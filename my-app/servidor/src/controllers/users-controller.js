import User from '../models/user.js';
import crypto from 'crypto';

const controller = {};

// GET - Buscar usuários com paginação e filtros opcionais
controller.getUsers = async (req, res) => {
    try {
        // Recebe filtros e parâmetros de paginação da query string
        const { 
            tipo,           // filtro opcional por tipo de usuário ('cliente' ou 'administrador')
            pagina = 1,     // página atual, padrão 1
            limite = 8,     // itens por página, padrão 8
            busca           // termo para busca por nome ou email (case insensitive)
        } = req.query;

        // Converte pagina e limite para números inteiros
        const paginaNum = parseInt(pagina);
        const limiteNum = parseInt(limite);
        const skip = (paginaNum - 1) * limiteNum; // cálculo para pular itens na consulta

        // Inicializa filtro vazio
        let filtro = {};
        
        // Se fornecido, adiciona filtro por tipo de usuário
        if (tipo) {
            filtro.tipo = tipo;
        }

        // Se fornecido termo de busca, cria regex case-insensitive para nome ou email
        if (busca) {
            const termoRegex = new RegExp(busca, 'i');
        
            filtro.$or = [
                { nome: termoRegex },
                { email: termoRegex }
            ];
        }    

        // Consulta usuários no banco com filtro, excluindo senha, ordenando por nome
        const usuarios = await User.find(filtro)
            .select('-senha') 
            .sort({ nome: 1 })
            .skip(skip)
            .limit(limiteNum);

        // Conta total de usuários que batem com o filtro para paginação
        const total = await User.countDocuments(filtro);
        const totalPaginas = Math.ceil(total / limiteNum);

        // Retorna dados com usuários e informações de paginação
        res.status(200).send({
            usuarios,
            paginacao: {
                paginaAtual: paginaNum,
                totalPaginas,
                totalItens: total,
                itensPorPagina: limiteNum,
                temProximaPagina: paginaNum < totalPaginas,
                temPaginaAnterior: paginaNum > 1
            }
        });

    } catch (e) {
        // Em caso de erro, retorna status 400 com mensagem e dados do erro
        res.status(400).send({
            message: 'Erro ao buscar usuários.',
            data: e
        });
    }
};

// POST - Login de usuário (autenticação simples com email e senha)
controller.entrar = async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // Busca usuário ativo com email e senha informados
        const user = await User.findOne({ 
            email: email, 
            senha: senha, 
            estadoConta: 'ativo' 
        });

        if (!user) {
            // Se não encontrou usuário, retorna erro 401 Unauthorized
            return res.status(401).send({ 
                message: 'Login inválido.' 
            });
        }

        // Retorna token, tipo e mensagem de sucesso para o cliente
        res.status(200).send({
            token: user.token,
            tipo: user.tipo,
            message: 'Login realizado com sucesso!'
        });
        
    } catch (e) {
        // Erro inesperado retorna status 400
        res.status(400).send({
            message: 'Erro ao fazer login.',
            data: e
        });
    }
};

// POST - Registrar novo usuário (cliente por padrão)
controller.registrar = async (req, res) => {
    try {
        // Extrai dados obrigatórios do corpo da requisição
        const { nome, email, senha, telefone, rua, cidade, estado, cep, pais } = req.body;
        
        // Validação: todos os campos obrigatórios devem estar presentes
        if (!nome || !email || !senha || !telefone || !rua || !cidade || !estado || !cep || !pais) {
            return res.status(400).send({ 
                message: 'Todos os campos são obrigatórios.' 
            });
        }

        // Verifica se já existe usuário com esse email para evitar duplicidade
        const usuarioExistente = await User.findOne({ email: email });
        if (usuarioExistente) {
            return res.status(400).send({ 
                message: 'Este email já está em uso.' 
            });
        }

        // Gera um token único aleatório para o usuário
        const token = crypto.randomBytes(32).toString('hex');

        // Cria e salva o novo usuário com tipo 'cliente' e conta ativa
        const novoUsuario = new User({
            nome,
            email,
            senha,
            telefone,
            rua,
            cidade,
            estado,
            cep,
            pais,
            token,
            tipo: 'cliente',
            estadoConta: 'ativo',
            carrinho: [],
            tamanhoCarrinho: [],
            quantiaCarrinho: []
        });

        await novoUsuario.save();

        // Retorna token e tipo para login automático após registro
        res.status(201).send({
            token: novoUsuario.token,
            tipo: novoUsuario.tipo,
            message: 'Usuário registrado com sucesso!'
        });
        
    } catch (e) {
        // Caso erro seja de duplicação de chave única (email)
        if (e.code === 11000) {
            return res.status(400).send({
                message: 'Este email já está em uso.'
            });
        }
        
        res.status(400).send({
            message: 'Erro ao registrar usuário.',
            data: e
        });
    }
};

// POST - Criar novo usuário com tipo definido (cliente ou administrador)
controller.postUsers = async (req, res) => {
    try {
        // Extrai dados do corpo, tipo padrão é 'cliente'
        const { 
            nome, email, senha, telefone, rua, cidade, estado, cep, pais, tipo = 'cliente' 
        } = req.body;
        
        // Validação dos campos obrigatórios
        if (!nome || !email || !senha || !telefone || !rua || !cidade || !estado || !cep || !pais) {
            return res.status(400).send({ 
                message: 'Todos os campos são obrigatórios.' 
            });
        }

        // Validação do tipo de usuário (deve ser 'cliente' ou 'administrador')
        if (!['cliente', 'administrador'].includes(tipo)) {
            return res.status(400).send({ 
                message: 'Tipo de usuário inválido. Use "cliente" ou "administrador".' 
            });
        }

        // Verifica se email já está cadastrado
        const usuarioExistente = await User.findOne({ email: email });
        if (usuarioExistente) {
            return res.status(400).send({ 
                message: 'Este email já está em uso.' 
            });
        }

        // Gera token único
        const token = crypto.randomBytes(32).toString('hex');

        // Cria e salva novo usuário com tipo informado
        const novoUsuario = new User({
            nome,
            email,
            senha,
            telefone,
            rua,
            cidade,
            estado,
            cep,
            pais,
            token,
            tipo,
            estadoConta: 'ativo',
            carrinho: [],
            tamanhoCarrinho: [],
            quantiaCarrinho: []
        });

        await novoUsuario.save();

        // Retorna mensagem de sucesso com tipo formatado (primeira letra maiúscula)
        res.status(201).send({
            message: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} criado com sucesso!`
        });
        
    } catch (e) {
        if (e.code === 11000) {
            // Retorna erro caso email já exista
            return res.status(400).send({
                message: 'Este email já está em uso.'
            });
        }
        
        res.status(400).send({
            message: 'Erro ao criar usuário.',
            data: e
        });
    }
};

// PUT - Atualizar usuário pelo token (parâmetro de rota)
controller.putUsers = async (req, res) => {
    try {
        const { token } = req.params; // token identificador do usuário
        const { 
            nome, email, senha, telefone, rua, cidade, estado, cep, pais, tipo, estadoConta
        } = req.body;
        
        // Valida token obrigatório
        if (!token) {
            return res.status(400).send({ 
                message: 'Token do usuário é obrigatório para atualização.' 
            });
        }

        // Busca usuário existente pelo token
        const usuarioExistente = await User.findOne({ token: token });
        if (!usuarioExistente) {
            return res.status(404).send({ 
                message: 'Usuário não encontrado.' 
            });
        }

        // Se email foi alterado, verifica se já está em uso por outro usuário
        if (email && email !== usuarioExistente.email) {
            const emailJaUsado = await User.findOne({ 
                email: email, 
                token: { $ne: token } 
            });
            if (emailJaUsado) {
                return res.status(400).send({ 
                    message: 'Este email já está em uso por outro usuário.' 
                });
            }
        }

        // Valida tipo de usuário se fornecido
        if (tipo && !['cliente', 'administrador'].includes(tipo)) {
            return res.status(400).send({ 
                message: 'Tipo de usuário inválido. Use "cliente" ou "administrador".' 
            });
        }

        // Valida estado da conta se fornecido
        if (estadoConta && !['ativo', 'inativo'].includes(estadoConta)) {
            return res.status(400).send({ 
                message: 'Estado da conta inválido. Use "ativo" ou "inativo".' 
            });
        }

        // Monta objeto somente com campos a atualizar que foram enviados
        const atualizacao = {};
        if (nome !== undefined) atualizacao.nome = nome;
        if (email !== undefined) atualizacao.email = email;
        if (senha !== undefined) atualizacao.senha = senha;
        if (telefone !== undefined) atualizacao.telefone = telefone;
        if (rua !== undefined) atualizacao.rua = rua;
        if (cidade !== undefined) atualizacao.cidade = cidade;
        if (estado !== undefined) atualizacao.estado = estado;
        if (cep !== undefined) atualizacao.cep = cep;
        if (pais !== undefined) atualizacao.pais = pais;
        if (tipo !== undefined) atualizacao.tipo = tipo;
        if (estadoConta !== undefined) atualizacao.estadoConta = estadoConta;

        // Atualiza o usuário no banco, retornando o novo documento (new: true) e validando campos
        await User.findOneAndUpdate(
            { token: token },
            atualizacao,
            { new: true, runValidators: true }
        );

        res.status(200).send({
            message: 'Usuário atualizado com sucesso!'
        });
        
    } catch (e) {
        if (e.code === 11000) {
            // Retorna erro para email duplicado
            return res.status(400).send({
                message: 'Este email já está em uso.'
            });
        }
        
        res.status(400).send({
            message: 'Erro ao atualizar usuário.',
            data: e
        });
    }
};

// DELETE - Excluir usuário pelo token (parâmetro de rota)
controller.deleteUsers = async (req, res) => {
    try {
        const { token } = req.params; // token obrigatório
        
        // Validação token
        if (!token) {
            return res.status(400).send({ 
                message: 'Token do usuário é obrigatório para exclusão.' 
            });
        }

        // Remove usuário pelo token
        const usuarioRemovido = await User.findOneAndDelete({ token: token });
        
        if (!usuarioRemovido) {
            return res.status(404).send({ 
                message: 'Usuário não encontrado.' 
            });
        }

        res.status(200).send({
            message: 'Usuário removido com sucesso!'
        });
        
    } catch (e) {
        res.status(400).send({
            message: 'Erro ao remover usuário.',
            data: e
        });
    }
};

// GET - Buscar perfil do usuário pelo token (parâmetro de rota)
controller.getPerfil = async (req, res) => {
    try {
        const { token } = req.params;
        
        // Validação token obrigatório
        if (!token) {
            return res.status(400).send({ 
                message: 'Token é obrigatório para buscar perfil.' 
            });
        }

        // Busca usuário pelo token, excluindo senha do resultado
        const usuario = await User.findOne({ token: token })
            .select('-senha');
        
        if (!usuario) {
            return res.status(404).send({ 
                message: 'Usuário não encontrado.' 
            });
        }

        res.status(200).send({
            usuario,
            message: 'Perfil encontrado com sucesso!'
        });
        
    } catch (e) {
        res.status(400).send({
            message: 'Erro ao buscar perfil.',
            data: e
        });
    }
};

// PUT - Atualizar perfil do usuário (com possibilidade de alterar senha)
controller.putPerfil = async (req, res) => {
    try {
        const { token } = req.params;
        const { 
            nome, email, telefone, rua, cidade, estado, cep, pais,
            senhaAtual, novaSenha, confirmarSenha
        } = req.body;
        
        // Validação token obrigatório
        if (!token) {
            return res.status(400).send({ 
                message: 'Token do usuário é obrigatório para atualização do perfil.' 
            });
        }

        // Busca usuário pelo token
        const usuarioExistente = await User.findOne({ token: token });
        if (!usuarioExistente) {
            return res.status(404).send({ 
                message: 'Usuário não encontrado.' 
            });
        }

        // Variáveis para controle da alteração de senha
        let senhaAlterada = false;
        let erroSenha = null;
        
        // Se algum campo relacionado à senha foi enviado, valida a troca de senha
        if (senhaAtual || novaSenha || confirmarSenha) {
            if (!senhaAtual) {
                erroSenha = 'Senha atual é obrigatória para alterar a senha.';
            } else if (!novaSenha) {
                erroSenha = 'Nova senha é obrigatória.';
            } else if (!confirmarSenha) {
                erroSenha = 'Confirmação de senha é obrigatória.';
            } else if (novaSenha !== confirmarSenha) {
                erroSenha = 'Nova senha e confirmação de senha não coincidem.';
            } else if (usuarioExistente.senha !== senhaAtual) {
                erroSenha = 'Senha atual incorreta.';
            } else {
                // Se passou em todas validações, marca senha como alterada
                senhaAlterada = true;
            }
        }

        // Verifica se novo email já está em uso por outro usuário
        if (email && email !== usuarioExistente.email) {
            const emailJaUsado = await User.findOne({ 
                email: email, 
                token: { $ne: token } 
            });
            if (emailJaUsado) {
                return res.status(400).send({ 
                    message: 'Este email já está em uso por outro usuário.' 
                });
            }
        }

        // Monta objeto para atualizar com campos fornecidos
        const atualizacao = {};
        if (nome !== undefined) atualizacao.nome = nome;
        if (email !== undefined) atualizacao.email = email;
        if (telefone !== undefined) atualizacao.telefone = telefone;
        if (rua !== undefined) atualizacao.rua = rua;
        if (cidade !== undefined) atualizacao.cidade = cidade;
        if (estado !== undefined) atualizacao.estado = estado;
        if (cep !== undefined) atualizacao.cep = cep;
        if (pais !== undefined) atualizacao.pais = pais;
        
        // Se senha foi validada e deve ser atualizada, inclui no objeto
        if (senhaAlterada) {
            atualizacao.senha = novaSenha;
        }

        // Atualiza perfil do usuário e retorna novo documento sem a senha
        const usuarioAtualizado = await User.findOneAndUpdate(
            { token: token },
            atualizacao,
            { new: true, runValidators: true }
        ).select('-senha');

        // Prepara mensagem de retorno de acordo com alteração da senha
        let mensagem = '';
        if (senhaAlterada) {
            mensagem = 'Perfil e senha atualizados com sucesso!';
        } else if (erroSenha) {
            mensagem = `Perfil atualizado com sucesso, mas houve um erro com a senha: ${erroSenha}`;
        } else {
            mensagem = 'Perfil atualizado com sucesso!';
        }

        res.status(200).send({
            usuario: usuarioAtualizado,
            message: mensagem,
            senhaAlterada,
            erroSenha
        });
        
    } catch (e) {
        if (e.code === 11000) {
            return res.status(400).send({
                message: 'Este email já está em uso.'
            });
        }
        
        res.status(400).send({
            message: 'Erro ao atualizar perfil.',
            data: e
        });
    }
};

// GET - Buscar carrinho do usuário pelo token
controller.getCarrinho = async (req, res) => {
    try {
        const { token } = req.params;
        
        // Validação token obrigatório
        if (!token) {
            return res.status(400).send({ 
                message: 'Token do usuário é obrigatório para buscar carrinho.' 
            });
        }

        // Busca usuário pelo token, retornando apenas os campos do carrinho
        const usuario = await User.findOne({ token: token })
            .select('carrinho tamanhoCarrinho quantiaCarrinho');
        
        if (!usuario) {
            return res.status(404).send({ 
                message: 'Usuário não encontrado.' 
            });
        }

        res.status(200).send({
            carrinho: usuario.carrinho || [],
            tamanhoCarrinho: usuario.tamanhoCarrinho || [],
            quantiaCarrinho: usuario.quantiaCarrinho || [],
            message: 'Carrinho encontrado com sucesso!'
        });
        
    } catch (e) {
        res.status(400).send({
            message: 'Erro ao buscar carrinho.',
            data: e
        });
    }
};

// PUT - Atualizar carrinho do usuário (arrays carrinho, tamanhoCarrinho e quantiaCarrinho devem ter mesmo tamanho)
controller.putCarrinho = async (req, res) => {
    try {
        const { token } = req.params;
        const { 
            carrinho = [],
            tamanhoCarrinho = [],
            quantiaCarrinho = []
        } = req.body;
        
        // Validação token obrigatório
        if (!token) {
            return res.status(400).send({ 
                message: 'Token do usuário é obrigatório para atualizar carrinho.' 
            });
        }

        // Busca usuário pelo token
        const usuarioExistente = await User.findOne({ token: token });
        if (!usuarioExistente) {
            return res.status(404).send({ 
                message: 'Usuário não encontrado.' 
            });
        }

        // Valida que os três arrays possuem o mesmo tamanho
        if (carrinho.length !== tamanhoCarrinho.length || carrinho.length !== quantiaCarrinho.length) {
            return res.status(400).send({ 
                message: 'Os arrays de carrinho, tamanho e quantidade devem ter o mesmo tamanho.' 
            });
        }

        // Valida que todas as quantidades são números inteiros positivos
        for (let i = 0; i < quantiaCarrinho.length; i++) {
            if (!Number.isInteger(quantiaCarrinho[i]) || quantiaCarrinho[i] <= 0) {
                return res.status(400).send({ 
                    message: 'Todas as quantidades devem ser números inteiros positivos.' 
                });
            }
        }

        // Atualiza campos do carrinho do usuário
        await User.findOneAndUpdate(
            { token: token },
            {
                carrinho: carrinho,
                tamanhoCarrinho: tamanhoCarrinho,
                quantiaCarrinho: quantiaCarrinho
            },
            { new: true, runValidators: true }
        );

        res.status(200).send({
            message: 'Carrinho atualizado com sucesso!'
        });
        
    } catch (e) {
        res.status(400).send({
            message: 'Erro ao atualizar carrinho.',
            data: e
        });
    }
};

// POST - Registrar múltiplos usuários em lote
controller.usersLote = async (req, res) => {
    try {
        const usuarios = req.body;

        // Valida que o corpo é um array não vazio
        if (!Array.isArray(usuarios) || usuarios.length === 0) {
            return res.status(400).send({ message: 'Envie um array de usuários.' });
        }

        const criados = [];
        // Para cada usuário no array, cria token, seta estado e salva no banco
        for (let u of usuarios) {
            const token = crypto.randomBytes(32).toString('hex');
            const novo = new User({ ...u, token, estadoConta: 'ativo' });
            await novo.save();
            criados.push(novo);
        }

        // Retorna quantidade criada e dados
        res.status(201).send({ message: `${criados.length} usuários criados.`, usuarios: criados });
    } catch (e) {
        res.status(400).send({ message: 'Erro ao criar usuários em lote.', data: e });
    }
};

// GET - Buscar todos os usuários (sem paginação), excluindo senha, ordenado por nome
controller.usersTodos = async (req, res) => {
    try {
        const usuarios = await User.find().select('-senha').sort({ nome: 1 });
        res.status(200).send({ usuarios });
    } catch (e) {
        res.status(400).send({ message: 'Erro ao buscar todos os usuários.', data: e });
    }
};

export default controller;
