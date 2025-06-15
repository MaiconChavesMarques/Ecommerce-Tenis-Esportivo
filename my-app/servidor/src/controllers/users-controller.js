import User from '../models/user.js';
import crypto from 'crypto';

const controller = {};

controller.getUsers = async (req, res) => {
    try {
        const { 
            tipo, 
            pagina = 1, 
            limite = 8, 
            busca 
        } = req.query;

        // Converte parâmetros para números
        const paginaNum = parseInt(pagina);
        const limiteNum = parseInt(limite);
        const skip = (paginaNum - 1) * limiteNum;

        // Constrói filtro de busca
        let filtro = {};
        
        // Adiciona filtro por tipo se especificado
        if (tipo) {
            filtro.tipo = tipo;
        }

        // Adiciona filtro de busca por nome ou email se especificado
        if (busca) {
            const termoRegex = new RegExp(busca, 'i'); // 'i' = case-insensitive
        
            filtro.$or = [
                { nome: termoRegex },
                { email: termoRegex }
            ];
        }    

        // Busca usuários com paginação
        const usuarios = await User.find(filtro)
            .select('-senha') // Exclui senha dos resultados
            .sort({ nome: 1 }) // Ordena por nome
            .skip(skip)
            .limit(limiteNum);

        // Conta total de usuários para calcular páginas
        const total = await User.countDocuments(filtro);
        const totalPaginas = Math.ceil(total / limiteNum);

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
        res.status(400).send({
            message: 'Erro ao buscar usuários.',
            data: e
        });
    }
};

controller.entrar = async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // Busca usuário por email e senha, apenas se conta estiver ativa
        const user = await User.findOne({ 
            email: email, 
            senha: senha, 
            estadoConta: 'ativo' 
        });

        if (!user) {
            return res.status(401).send({ 
                message: 'Login inválido.' 
            });
        }

        // Retorna dados do usuário para o login
        res.status(200).send({
            token: user.token,
            tipo: user.tipo,
            message: 'Login realizado com sucesso!'
        });
        
    } catch (e) {
        res.status(400).send({
            message: 'Erro ao fazer login.',
            data: e
        });
    }
};

controller.registrar = async (req, res) => {
    try {
        const { nome, email, senha, telefone, rua, cidade, estado, cep, pais } = req.body;
        
        // Validação dos campos obrigatórios
        if (!nome || !email || !senha || !telefone || !rua || !cidade || !estado || !cep || !pais) {
            return res.status(400).send({ 
                message: 'Todos os campos são obrigatórios.' 
            });
        }

        // Verifica se o email já está em uso
        const usuarioExistente = await User.findOne({ email: email });
        if (usuarioExistente) {
            return res.status(400).send({ 
                message: 'Este email já está em uso.' 
            });
        }

        // Gera token único
        const token = crypto.randomBytes(32).toString('hex');

        // Cria novo usuário
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

        // Retorna dados do usuário para login automático
        res.status(201).send({
            token: novoUsuario.token,
            tipo: novoUsuario.tipo,
            message: 'Usuário registrado com sucesso!'
        });
        
    } catch (e) {
        if (e.code === 11000) {
            // Erro de duplicação (email único)
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

controller.postUsers = async (req, res) => {
    try {
        const { 
            nome, 
            email, 
            senha, 
            telefone, 
            rua, 
            cidade, 
            estado, 
            cep, 
            pais, 
            tipo = 'cliente' 
        } = req.body;
        
        // Validação dos campos obrigatórios
        if (!nome || !email || !senha || !telefone || !rua || !cidade || !estado || !cep || !pais) {
            return res.status(400).send({ 
                message: 'Todos os campos são obrigatórios.' 
            });
        }

        // Validação do tipo de usuário
        if (!['cliente', 'administrador'].includes(tipo)) {
            return res.status(400).send({ 
                message: 'Tipo de usuário inválido. Use "cliente" ou "administrador".' 
            });
        }

        // Verifica se o email já está em uso
        const usuarioExistente = await User.findOne({ email: email });
        if (usuarioExistente) {
            return res.status(400).send({ 
                message: 'Este email já está em uso.' 
            });
        }

        // Gera token único
        const token = crypto.randomBytes(32).toString('hex');

        // Cria novo usuário
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

        res.status(201).send({
            message: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} criado com sucesso!`
        });
        
    } catch (e) {
        if (e.code === 11000) {
            // Erro de duplicação (email único)
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

controller.putUsers = async (req, res) => {
    try {
        const { token } = req.params; // Mudança: pega do parâmetro da rota
        const { 
            nome, 
            email, 
            senha, 
            telefone, 
            rua, 
            cidade, 
            estado, 
            cep, 
            pais, 
            tipo,
            estadoConta
        } = req.body;
        
        // Validação do token (identificador do usuário)
        if (!token) {
            return res.status(400).send({ 
                message: 'Token do usuário é obrigatório para atualização.' 
            });
        }

        // Busca o usuário pelo token
        const usuarioExistente = await User.findOne({ token: token });
        if (!usuarioExistente) {
            return res.status(404).send({ 
                message: 'Usuário não encontrado.' 
            });
        }

        // Verifica se o novo email já está em uso por outro usuário
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

        // Validação do tipo de usuário se fornecido
        if (tipo && !['cliente', 'administrador'].includes(tipo)) {
            return res.status(400).send({ 
                message: 'Tipo de usuário inválido. Use "cliente" ou "administrador".' 
            });
        }

        // Validação do estado da conta se fornecido
        if (estadoConta && !['ativo', 'inativo'].includes(estadoConta)) {
            return res.status(400).send({ 
                message: 'Estado da conta inválido. Use "ativo" ou "inativo".' 
            });
        }

        // Constrói objeto de atualização apenas com campos fornecidos
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

        // Atualiza o usuário
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
            // Erro de duplicação (email único)
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

controller.deleteUsers = async (req, res) => {
    try {
        const { token } = req.params; // Mudança: pega do parâmetro da rota
        
        // Validação do token
        if (!token) {
            return res.status(400).send({ 
                message: 'Token do usuário é obrigatório para exclusão.' 
            });
        }

        // Busca e remove o usuário pelo token
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

controller.getPerfil = async (req, res) => {
    try {
        const { token } = req.params; // Mudança: pega do parâmetro da rota
        
        // Validação do token
        if (!token) {
            return res.status(400).send({ 
                message: 'Token é obrigatório para buscar perfil.' 
            });
        }

        // Busca usuário pelo token, excluindo a senha dos resultados
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

controller.putPerfil = async (req, res) => {
    try {
        const { token } = req.params; // Mudança: pega do parâmetro da rota
        const { 
            nome, 
            email, 
            senha, 
            telefone, 
            rua, 
            cidade, 
            estado, 
            cep, 
            pais
        } = req.body;
        
        // Validação do token (identificador do usuário)
        if (!token) {
            return res.status(400).send({ 
                message: 'Token do usuário é obrigatório para atualização do perfil.' 
            });
        }

        // Busca o usuário pelo token
        const usuarioExistente = await User.findOne({ token: token });
        if (!usuarioExistente) {
            return res.status(404).send({ 
                message: 'Usuário não encontrado.' 
            });
        }

        // Verifica se o novo email já está em uso por outro usuário
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

        // Constrói objeto de atualização apenas com campos fornecidos
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

        // Atualiza o perfil do usuário
        const usuarioAtualizado = await User.findOneAndUpdate(
            { token: token },
            atualizacao,
            { new: true, runValidators: true }
        ).select('-senha'); // Exclui a senha do retorno

        res.status(200).send({
            usuario: usuarioAtualizado,
            message: 'Perfil atualizado com sucesso!'
        });
        
    } catch (e) {
        if (e.code === 11000) {
            // Erro de duplicação (email único)
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

controller.getCarrinho = async (req, res) => {
    try {
        const { token } = req.params;
        
        // Validação do token
        if (!token) {
            return res.status(400).send({ 
                message: 'Token do usuário é obrigatório para buscar carrinho.' 
            });
        }

        // Busca usuário pelo token, selecionando apenas os campos do carrinho
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

controller.putCarrinho = async (req, res) => {
    try {
        const { token } = req.params; // Mudança: pega do parâmetro da rota
        const { 
            carrinho = [],
            tamanhoCarrinho = [],
            quantiaCarrinho = []
        } = req.body;
        
        // Validação do token
        if (!token) {
            return res.status(400).send({ 
                message: 'Token do usuário é obrigatório para atualizar carrinho.' 
            });
        }

        // Busca o usuário pelo token
        const usuarioExistente = await User.findOne({ token: token });
        if (!usuarioExistente) {
            return res.status(404).send({ 
                message: 'Usuário não encontrado.' 
            });
        }

        // Validação: os arrays devem ter o mesmo tamanho
        if (carrinho.length !== tamanhoCarrinho.length || carrinho.length !== quantiaCarrinho.length) {
            return res.status(400).send({ 
                message: 'Os arrays de carrinho, tamanho e quantidade devem ter o mesmo tamanho.' 
            });
        }

        // Validação: quantidades devem ser números positivos
        for (let i = 0; i < quantiaCarrinho.length; i++) {
            if (!Number.isInteger(quantiaCarrinho[i]) || quantiaCarrinho[i] <= 0) {
                return res.status(400).send({ 
                    message: 'Todas as quantidades devem ser números inteiros positivos.' 
                });
            }
        }

        // Atualiza o carrinho do usuário
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

// POST - Registrar múltiplos usuários
controller.usersLote = async (req, res) => {
    try {
        const usuarios = req.body;

        if (!Array.isArray(usuarios) || usuarios.length === 0) {
            return res.status(400).send({ message: 'Envie um array de usuários.' });
        }

        const criados = [];
        for (let u of usuarios) {
            const token = crypto.randomBytes(32).toString('hex');
            const novo = new User({ ...u, token, estadoConta: 'ativo' });
            await novo.save();
            criados.push(novo);
        }

        res.status(201).send({ message: `${criados.length} usuários criados.`, usuarios: criados });
    } catch (e) {
        res.status(400).send({ message: 'Erro ao criar usuários em lote.', data: e });
    }
};

// GET - Buscar todos os usuários
controller.usersTodos = async (req, res) => {
    try {
        const usuarios = await User.find().select('-senha').sort({ nome: 1 });
        res.status(200).send({ usuarios });
    } catch (e) {
        res.status(400).send({ message: 'Erro ao buscar todos os usuários.', data: e });
    }
};

export default controller;