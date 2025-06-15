import User from '../models/user.js'; // Ajuste o caminho conforme sua estrutura
import Product from '../models/product.js'; // Também precisa estar importado

const controller = {};

// GET - Buscar produtos com paginação e filtros
controller.getProducts = async (req, res) => {
    try {
        const { 
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

        // Adiciona filtro de busca por nome, descrição ou preço se especificado
        if (busca) {
            const termoRegex = new RegExp(busca, 'i'); // 'i' = case-insensitive
            const precoNumerico = parseFloat(busca);
        
            filtro.$or = [
                { nome: termoRegex },
                { descricao: termoRegex }
            ];

            // Adiciona busca por preço se o termo for um número válido
            if (!isNaN(precoNumerico)) {
                filtro.$or.push({ preco: precoNumerico });
            }
        }    

        // Busca produtos com paginação
        const produtos = await Product.find(filtro)
            .sort({ nome: 1 }) // Ordena por nome
            .skip(skip)
            .limit(limiteNum);

        // Conta total de produtos para calcular páginas
        const total = await Product.countDocuments(filtro);
        const totalPaginas = Math.ceil(total / limiteNum);

        res.status(200).send({
            produtos,
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
            message: 'Erro ao buscar produtos.',
            data: e
        });
    }
};

// POST - Criar novo produto
controller.postProducts = async (req, res) => {
    try {
        const { 
            nome, 
            descricao, 
            preco, 
            imagem,
            tamanhos = [],
            quantidade = []
        } = req.body;
        
        // Validação dos campos obrigatórios
        if (!nome || !descricao || !preco || !imagem) {
            return res.status(400).send({ 
                message: 'Nome, descrição, preço e imagem são obrigatórios.' 
            });
        }

        // Gerar ID interno automaticamente
        const ultimoProduto = await Product.findOne().sort({ id_interno: -1 });
        const proximoId = ultimoProduto ? ultimoProduto.id_interno + 1 : 1;

        // Validação do preço
        if (isNaN(preco) || preco < 0) {
            return res.status(400).send({ 
                message: 'Preço deve ser um número válido e não negativo.' 
            });
        }

        // Validação dos tamanhos
        if (tamanhos.length > 0) {
            for (let tamanho of tamanhos) {
                if (!Number.isInteger(tamanho) || tamanho <= 0) {
                    return res.status(400).send({ 
                        message: 'Todos os tamanhos devem ser números inteiros positivos.' 
                    });
                }
            }
        }

        // Validação das quantidades
        if (quantidade.length > 0) {
            for (let qtd of quantidade) {
                if (!Number.isInteger(qtd) || qtd < 0) {
                    return res.status(400).send({ 
                        message: 'Todas as quantidades devem ser números inteiros não negativos.' 
                    });
                }
            }
        }

        // Validação: tamanhos e quantidades devem ter o mesmo comprimento
        if (tamanhos.length !== quantidade.length) {
            return res.status(400).send({ 
                message: 'Os arrays de tamanhos e quantidades devem ter o mesmo tamanho.' 
            });
        }

        // Cria novo produto com ID interno gerado automaticamente
        const novoProduto = new Product({
            id_interno: proximoId,
            nome,
            descricao,
            preco: parseFloat(preco),
            imagem,
            tamanhos,
            quantidade
        });

        await novoProduto.save();

        res.status(201).send({
            message: 'Produto criado com sucesso!',
            id_interno: proximoId
        });
        
    } catch (e) {
        if (e.code === 11000) {
            // Erro de duplicação (ID interno único)
            return res.status(400).send({
                message: 'Erro de duplicação. Tente novamente.'
            });
        }
        
        res.status(400).send({
            message: 'Erro ao criar produto.',
            data: e
        });
    }
};

// PUT - Atualizar produto existente
controller.putProducts = async (req, res) => {
    try {
        // Pega o ID interno da URL
        const { id_interno } = req.params;
        
        const { 
            nome, 
            descricao, 
            preco, 
            imagem,
            tamanhos,
            quantidade
        } = req.body;
        
        // Converte o ID para número
        const idInterno = parseInt(id_interno);
        
        // Validação do ID interno
        if (isNaN(idInterno) || idInterno <= 0) {
            return res.status(400).send({ 
                message: 'ID interno deve ser um número inteiro positivo.' 
            });
        }

        // Busca o produto pelo ID interno
        const produtoExistente = await Product.findOne({ id_interno: idInterno });
        if (!produtoExistente) {
            return res.status(404).send({ 
                message: 'Produto não encontrado.' 
            });
        }

        // Validação do preço se fornecido
        if (preco !== undefined && (isNaN(preco) || preco < 0)) {
            return res.status(400).send({ 
                message: 'Preço deve ser um número válido e não negativo.' 
            });
        }

        // Validação dos tamanhos se fornecidos
        if (tamanhos !== undefined && tamanhos.length > 0) {
            for (let tamanho of tamanhos) {
                if (!Number.isInteger(tamanho) || tamanho <= 0) {
                    return res.status(400).send({ 
                        message: 'Todos os tamanhos devem ser números inteiros positivos.' 
                    });
                }
            }
        }

        // Validação das quantidades se fornecidas
        if (quantidade !== undefined && quantidade.length > 0) {
            for (let qtd of quantidade) {
                if (!Number.isInteger(qtd) || qtd < 0) {
                    return res.status(400).send({ 
                        message: 'Todas as quantidades devem ser números inteiros não negativos.' 
                    });
                }
            }
        }

        // Validação: se ambos forem fornecidos, devem ter o mesmo comprimento
        if (tamanhos !== undefined && quantidade !== undefined && tamanhos.length !== quantidade.length) {
            return res.status(400).send({ 
                message: 'Os arrays de tamanhos e quantidades devem ter o mesmo tamanho.' 
            });
        }

        // Constrói objeto de atualização apenas com campos fornecidos
        const atualizacao = {};
        if (nome !== undefined) atualizacao.nome = nome;
        if (descricao !== undefined) atualizacao.descricao = descricao;
        if (preco !== undefined) atualizacao.preco = parseFloat(preco);
        if (imagem !== undefined) atualizacao.imagem = imagem;
        if (tamanhos !== undefined) atualizacao.tamanhos = tamanhos;
        if (quantidade !== undefined) atualizacao.quantidade = quantidade;

        // Atualiza o produto
        await Product.findOneAndUpdate(
            { id_interno: idInterno },
            atualizacao,
            { new: true, runValidators: true }
        );

        res.status(200).send({
            message: 'Produto atualizado com sucesso!'
        });
        
    } catch (e) {
        res.status(400).send({
            message: 'Erro ao atualizar produto.',
            data: e
        });
    }
};

// DELETE - Remover produto
controller.deleteProducts = async (req, res) => {
    try {
        // Pega o ID interno da URL
        const { id_interno } = req.params;
        
        // Converte o ID para número
        const idInterno = parseInt(id_interno);
        
        // Validação do ID interno
        if (isNaN(idInterno) || idInterno <= 0) {
            return res.status(400).send({ 
                message: 'ID interno deve ser um número inteiro positivo.' 
            });
        }

        // Busca e remove o produto pelo ID interno
        const produtoRemovido = await Product.findOneAndDelete({ id_interno: idInterno });
        
        if (!produtoRemovido) {
            return res.status(404).send({ 
                message: 'Produto não encontrado.' 
            });
        }

        res.status(200).send({
            message: 'Produto removido com sucesso!'
        });
        
    } catch (e) {
        res.status(400).send({
            message: 'Erro ao remover produto.',
            data: e
        });
    }
};

// GET - Buscar produtos para home com paginação e filtros
controller.getHome = async (req, res) => {
    try {
        const { 
            pagina = 1, 
            limite = 15, 
            busca 
        } = req.query;

        // Converte parâmetros para números
        const paginaNum = parseInt(pagina);
        const limiteNum = parseInt(limite);
        const skip = (paginaNum - 1) * limiteNum;

        // Constrói filtro de busca
        let filtro = {};

        // Adiciona filtro de busca por nome ou preço se especificado
        if (busca) {
            const termoRegex = new RegExp(busca, 'i'); // 'i' = case-insensitive
            const precoNumerico = parseFloat(busca);
        
            filtro.$or = [
                { nome: termoRegex }
            ];

            // Adiciona busca por preço se o termo for um número válido
            if (!isNaN(precoNumerico)) {
                filtro.$or.push({ preco: precoNumerico });
            }
        }    

        // Busca produtos com paginação
        const produtos = await Product.find(filtro)
            .sort({ nome: 1 }) // Ordena por nome
            .skip(skip)
            .limit(limiteNum);

        // Conta total de produtos para calcular páginas
        const total = await Product.countDocuments(filtro);
        const totalPaginas = Math.ceil(total / limiteNum);

        res.status(200).send({
            produtos,
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
            message: 'Erro ao buscar produtos.',
            data: e
        });
    }
};

// GET - Buscar produto específico com produtos semelhantes
controller.getPage = async (req, res) => {
    try {
        // Pega o ID interno da URL
        const { id_interno } = req.params;
        
        // Converte o ID para número
        const idInterno = parseInt(id_interno);
        
        // Validação do ID interno
        if (isNaN(idInterno) || idInterno <= 0) {
            return res.status(400).send({ 
                message: 'ID interno deve ser um número inteiro positivo.' 
            });
        }

        // Busca o produto específico pelo ID interno
        const produto = await Product.findOne({ id_interno: idInterno });
        
        if (!produto) {
            return res.status(404).send({ 
                message: 'Produto não encontrado.' 
            });
        }

        // Busca todos os produtos exceto o atual, ordenados por preço
        const todosProdutos = await Product.find({ 
            id_interno: { $ne: idInterno } 
        }).sort({ preco: 1 });

        // Encontra a posição onde o preço do produto atual se encaixaria
        const precoAtual = produto.preco;
        let posicaoAtual = todosProdutos.findIndex(p => p.preco >= precoAtual);
        
        // Se preço do produto atual for maior que todos, coloca no final
        if (posicaoAtual === -1) {
            posicaoAtual = todosProdutos.length;
        }

        // Estratégia para coletar 6 produtos semelhantes
        const semelhantes = [];
        const totalDesejado = 6;
        
        // Calcula produtos disponíveis antes e depois da posição
        const disponivelAntes = posicaoAtual;
        const disponivelDepois = todosProdutos.length - posicaoAtual;
        
        // Tenta pegar 3 antes e 3 depois, ajustando conforme disponibilidade
        let elementosAntes = Math.min(3, disponivelAntes);
        let elementosDepois = Math.min(3, disponivelDepois);
        
        // Rebalanceia se um lado não tem elementos suficientes
        if (elementosAntes < 3 && disponivelDepois > 3) {
            elementosDepois = Math.min(totalDesejado - elementosAntes, disponivelDepois);
        } else if (elementosDepois < 3 && disponivelAntes > 3) {
            elementosAntes = Math.min(totalDesejado - elementosDepois, disponivelAntes);
        }
        
        // Adiciona produtos com preços menores
        const inicioAntes = Math.max(0, posicaoAtual - elementosAntes);
        for (let i = inicioAntes; i < posicaoAtual; i++) {
            semelhantes.push(todosProdutos[i]);
        }
        
        // Adiciona produtos com preços maiores
        const fimDepois = Math.min(todosProdutos.length, posicaoAtual + elementosDepois);
        for (let i = posicaoAtual; i < fimDepois; i++) {
            semelhantes.push(todosProdutos[i]);
        }

        res.status(200).send({
            produto,
            produtosSemelhantes: semelhantes.slice(0, 6)
        });

    } catch (e) {
        res.status(400).send({
            message: 'Erro ao buscar produto.',
            data: e
        });
    }
};

// POST - Buscar múltiplos produtos para carrinho
controller.getCarrinho = async (req, res) => {
    try {
        const { ids } = req.body;
        
        // Validação dos IDs
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).send({ 
                message: 'Array de IDs é obrigatório e deve conter pelo menos um ID.' 
            });
        }

        // Validação se todos os IDs são números inteiros positivos
        for (let id of ids) {
            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).send({ 
                    message: 'Todos os IDs devem ser números inteiros positivos.' 
                });
            }
        }

        // Busca produtos pelos IDs internos
        const produtos = await Product.find({ 
            id_interno: { $in: ids } 
        });

        // Retorna apenas os produtos encontrados
        res.status(200).send({
            produtos,
            total: produtos.length
        });
        
    } catch (e) {
        res.status(400).send({
            message: 'Erro ao buscar produtos do carrinho.',
            data: e
        });
    }
};

// POST - Processar pagamento e limpar carrinho
controller.postPagamento = async (req, res) => {
    try {
        const { 
            usuario_token,
            carrinho = [],
            valores,
            pagamento
        } = req.body;
        
        // Validação do token
        if (!usuario_token) {
            return res.status(400).send({ 
                message: 'Token do usuário é obrigatório para processar pagamento.'
            });
        }

        // Busca o usuário pelo token
        const usuarioExistente = await User.findOne({ token: usuario_token });
        if (!usuarioExistente) {
            return res.status(404).send({ 
                message: 'Usuário não encontrado.' 
            });
        }

        // Validação do carrinho
        if (!carrinho || !Array.isArray(carrinho) || carrinho.length === 0) {
            return res.status(400).send({ 
                message: 'Carrinho é obrigatório e deve conter pelo menos um item.' 
            });
        }

        // Validação dos valores
        if (!valores || typeof valores.total !== 'number' || valores.total <= 0) {
            return res.status(400).send({ 
                message: 'Valores de pagamento são obrigatórios e o total deve ser positivo.' 
            });
        }

        // Validação dos dados de pagamento
        if (!pagamento || !pagamento.numero_cartao || !pagamento.nome_cartao || 
            !pagamento.data_vencimento || !pagamento.cvc) {
            return res.status(400).send({ 
                message: 'Dados completos do cartão são obrigatórios.' 
            });
        }

        // Busca os produtos do carrinho para validar estoque
        const idsCarrinho = carrinho.map(item => item.id);
        const produtos = await Product.find({ 
            id_interno: { $in: idsCarrinho } 
        });

        // Valida se todos os produtos existem e têm estoque suficiente
        for (let itemCarrinho of carrinho) {
            const produto = produtos.find(p => p.id_interno === itemCarrinho.id);
            
            if (!produto) {
                return res.status(400).send({ 
                    message: `Produto com ID ${itemCarrinho.id} não encontrado.` 
                });
            }

            const tamanhoIndex = produto.tamanhos.indexOf(itemCarrinho.tamanho);
            if (tamanhoIndex === -1) {
                return res.status(400).send({ 
                    message: `Tamanho ${itemCarrinho.tamanho} não disponível para o produto ${produto.nome}.` 
                });
            }

            if (produto.quantidade[tamanhoIndex] < itemCarrinho.quantidade) {
                return res.status(400).send({ 
                    message: `Estoque insuficiente para o produto ${produto.nome} no tamanho ${itemCarrinho.tamanho}.` 
                });
            }
        }

        // Atualiza o estoque dos produtos
        for (let itemCarrinho of carrinho) {
            const produto = produtos.find(p => p.id_interno === itemCarrinho.id);
            const tamanhoIndex = produto.tamanhos.indexOf(itemCarrinho.tamanho);
            
            // Diminui a quantidade do estoque
            const novaQuantidade = [...produto.quantidade];
            novaQuantidade[tamanhoIndex] = Math.max(0, novaQuantidade[tamanhoIndex] - itemCarrinho.quantidade);
            
            await Product.findOneAndUpdate(
                { id_interno: itemCarrinho.id },
                { quantidade: novaQuantidade },
                { new: true }
            );
        }

        // Limpa o carrinho do usuário
        await User.findOneAndUpdate(
            { token: usuario_token },
            {
                carrinho: [],
                tamanhoCarrinho: [],
                quantiaCarrinho: []
            },
            { new: true }
        );

        // Simula processamento do pagamento (aqui você integraria com gateway de pagamento)
        // Por enquanto, apenas retorna sucesso
        
        res.status(200).send({
            message: 'Pagamento processado com sucesso!',
            transacao: {
                usuario: usuarioExistente.nome,
                total: valores.total,
                itens: carrinho.length,
                data: new Date()
            }
        });
        
    } catch (e) {
        res.status(400).send({
            message: 'Erro ao processar pagamento.',
            data: e
        });
    }
};

// POST - Adicionar múltiplos produtos
controller.productsLote = async (req, res) => {
    try {
        const produtos = req.body;
 
        if (!Array.isArray(produtos) || produtos.length < 1) {
            return res.status(400).send({ message: 'Envie um array de produtos.' });
        }
 
        const resultados = [];
        for (let produto of produtos) {
            const novoProduto = new Product(produto);
            await novoProduto.save();
            resultados.push(novoProduto);
        }
 
        res.status(201).send({
            message: `${resultados.length} produtos criados com sucesso.`,
            produtos: resultados
        });
    } catch (e) {
        res.status(400).send({ message: 'Erro ao criar produtos em lote.', data: e });
    }
 };
 
 // GET - Buscar todos os produtos
 controller.productsTodos = async (req, res) => {
    try {
        const produtos = await Product.find().sort({ nome: 1 });
        res.status(200).send({ produtos });
    } catch (e) {
        res.status(400).send({ message: 'Erro ao buscar todos os produtos.', data: e });
    }
 };

export default controller;