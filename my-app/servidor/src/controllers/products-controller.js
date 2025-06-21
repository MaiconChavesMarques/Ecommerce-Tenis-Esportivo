import User from '../models/user.js'; // Importa o modelo User para manipular dados de usuários
import Product from '../models/product.js'; // Importa o modelo Product para manipular dados de produtos

const controller = {}; // Objeto que armazenará os métodos do controller

// GET - Buscar produtos com paginação e filtros
controller.getProducts = async (req, res) => {
    try {
        // Desestruturação dos parâmetros da query, com valores padrão para pagina e limite
        const { 
            pagina = 1, 
            limite = 8, 
            busca 
        } = req.query;

        // Converte os parâmetros recebidos em string para números inteiros
        const paginaNum = parseInt(pagina);
        const limiteNum = parseInt(limite);
        // Calcula quantos documentos devem ser pulados para a paginação
        const skip = (paginaNum - 1) * limiteNum;

        // Inicializa o filtro de busca vazio
        let filtro = {};

        // Se o parâmetro de busca existir, cria filtros para nome, descrição e preço
        if (busca) {
            const termoRegex = new RegExp(busca, 'i'); // Regex para busca case-insensitive
            const precoNumerico = parseFloat(busca);
        
            // Filtro OR para nome e descrição contendo o termo
            filtro.$or = [
                { nome: termoRegex },
                { descricao: termoRegex }
            ];

            // Se o termo de busca for um número válido, adiciona filtro para preço exato
            if (!isNaN(precoNumerico)) {
                filtro.$or.push({ preco: precoNumerico });
            }
        }    

        // Consulta os produtos no banco aplicando o filtro, ordenando por nome, pulando e limitando conforme paginação
        const produtos = await Product.find(filtro)
            .sort({ nome: 1 }) // Ordena os produtos pelo campo nome em ordem crescente
            .skip(skip)        // Pula os documentos conforme o cálculo da paginação
            .limit(limiteNum); // Limita a quantidade de produtos retornados

        // Conta o total de produtos que batem com o filtro para calcular o número total de páginas
        const total = await Product.countDocuments(filtro);
        const totalPaginas = Math.ceil(total / limiteNum);

        // Retorna os produtos encontrados e informações de paginação no response
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
        // Em caso de erro, retorna status 400 com mensagem e dados do erro
        res.status(400).send({
            message: 'Erro ao buscar produtos.',
            data: e
        });
    }
};

// POST - Criar novo produto
controller.postProducts = async (req, res) => {
    try {
        // Desestruturação dos campos do corpo da requisição
        const { 
            nome, 
            descricao, 
            preco, 
            imagem,
            tamanhos = [],    // Valor padrão para tamanhos é array vazio
            quantidade = []   // Valor padrão para quantidade é array vazio
        } = req.body;
        
        // Valida se os campos obrigatórios foram enviados
        if (!nome || !descricao || !preco || !imagem) {
            return res.status(400).send({ 
                message: 'Nome, descrição, preço e imagem são obrigatórios.' 
            });
        }

        // Busca o produto com maior id_interno para gerar o próximo ID sequencial
        const ultimoProduto = await Product.findOne().sort({ id_interno: -1 });
        const proximoId = ultimoProduto ? ultimoProduto.id_interno + 1 : 1;

        // Valida se o preço é número válido e não negativo
        if (isNaN(preco) || preco < 0) {
            return res.status(400).send({ 
                message: 'Preço deve ser um número válido e não negativo.' 
            });
        }

        // Validação dos tamanhos (devem ser inteiros positivos)
        if (tamanhos.length > 0) {
            for (let tamanho of tamanhos) {
                if (!Number.isInteger(tamanho) || tamanho <= 0) {
                    return res.status(400).send({ 
                        message: 'Todos os tamanhos devem ser números inteiros positivos.' 
                    });
                }
            }
        }

        // Validação das quantidades (devem ser inteiros não negativos)
        if (quantidade.length > 0) {
            for (let qtd of quantidade) {
                if (!Number.isInteger(qtd) || qtd < 0) {
                    return res.status(400).send({ 
                        message: 'Todas as quantidades devem ser números inteiros não negativos.' 
                    });
                }
            }
        }

        // Validação para garantir que tamanhos e quantidades tenham o mesmo tamanho
        if (tamanhos.length !== quantidade.length) {
            return res.status(400).send({ 
                message: 'Os arrays de tamanhos e quantidades devem ter o mesmo tamanho.' 
            });
        }

        // Cria novo documento de produto com os dados fornecidos e ID interno gerado
        const novoProduto = new Product({
            id_interno: proximoId,
            nome,
            descricao,
            preco: parseFloat(preco), // Converte preço para número float
            imagem,
            tamanhos,
            quantidade
        });

        // Salva o novo produto no banco
        await novoProduto.save();

        // Retorna sucesso com ID do novo produto criado
        res.status(201).send({
            message: 'Produto criado com sucesso!',
            id_interno: proximoId
        });
        
    } catch (e) {
        if (e.code === 11000) {
            // Tratamento específico para erro de duplicação de chave única (ID interno)
            return res.status(400).send({
                message: 'Erro de duplicação. Tente novamente.'
            });
        }
        
        // Retorna erro genérico para outras exceções
        res.status(400).send({
            message: 'Erro ao criar produto.',
            data: e
        });
    }
};

// PUT - Atualizar produto existente
controller.putProducts = async (req, res) => {
    try {
        // Obtém o id_interno do parâmetro da URL
        const { id_interno } = req.params;
        
        // Desestrutura campos enviados no corpo da requisição
        const { 
            nome, 
            descricao, 
            preco, 
            imagem,
            tamanhos,
            quantidade
        } = req.body;
        
        // Converte o id_interno para número inteiro
        const idInterno = parseInt(id_interno);
        
        // Validação para garantir que o id seja válido
        if (isNaN(idInterno) || idInterno <= 0) {
            return res.status(400).send({ 
                message: 'ID interno deve ser um número inteiro positivo.' 
            });
        }

        // Busca o produto existente pelo id_interno
        const produtoExistente = await Product.findOne({ id_interno: idInterno });
        if (!produtoExistente) {
            return res.status(404).send({ 
                message: 'Produto não encontrado.' 
            });
        }

        // Validação do preço se foi fornecido
        if (preco !== undefined && (isNaN(preco) || preco < 0)) {
            return res.status(400).send({ 
                message: 'Preço deve ser um número válido e não negativo.' 
            });
        }

        // Validação dos tamanhos, se fornecidos (devem ser inteiros positivos)
        if (tamanhos !== undefined && tamanhos.length > 0) {
            for (let tamanho of tamanhos) {
                if (!Number.isInteger(tamanho) || tamanho <= 0) {
                    return res.status(400).send({ 
                        message: 'Todos os tamanhos devem ser números inteiros positivos.' 
                    });
                }
            }
        }

        // Validação das quantidades, se fornecidas (devem ser inteiros não negativos)
        if (quantidade !== undefined && quantidade.length > 0) {
            for (let qtd of quantidade) {
                if (!Number.isInteger(qtd) || qtd < 0) {
                    return res.status(400).send({ 
                        message: 'Todas as quantidades devem ser números inteiros não negativos.' 
                    });
                }
            }
        }

        // Se ambos os arrays forem fornecidos, valida que possuem o mesmo tamanho
        if (tamanhos !== undefined && quantidade !== undefined && tamanhos.length !== quantidade.length) {
            return res.status(400).send({ 
                message: 'Os arrays de tamanhos e quantidades devem ter o mesmo tamanho.' 
            });
        }

        // Cria objeto de atualização somente com os campos que foram enviados na requisição
        const atualizacao = {};
        if (nome !== undefined) atualizacao.nome = nome;
        if (descricao !== undefined) atualizacao.descricao = descricao;
        if (preco !== undefined) atualizacao.preco = parseFloat(preco);
        if (imagem !== undefined) atualizacao.imagem = imagem;
        if (tamanhos !== undefined) atualizacao.tamanhos = tamanhos;
        if (quantidade !== undefined) atualizacao.quantidade = quantidade;

        // Atualiza o produto no banco com os dados enviados, retornando o documento atualizado
        await Product.findOneAndUpdate(
            { id_interno: idInterno },
            atualizacao,
            { new: true, runValidators: true }
        );

        // Retorna mensagem de sucesso
        res.status(200).send({
            message: 'Produto atualizado com sucesso!'
        });
        
    } catch (e) {
        // Em caso de erro retorna status 400 com dados do erro
        res.status(400).send({
            message: 'Erro ao atualizar produto.',
            data: e
        });
    }
};

// DELETE - Remover produto
controller.deleteProducts = async (req, res) => {
    try {
        // Obtém o id_interno do parâmetro da URL
        const { id_interno } = req.params;
        
        // Converte para número inteiro
        const idInterno = parseInt(id_interno);
        
        // Validação do id_interno
        if (isNaN(idInterno) || idInterno <= 0) {
            return res.status(400).send({ 
                message: 'ID interno deve ser um número inteiro positivo.' 
            });
        }

        // Busca e remove o produto correspondente ao id_interno
        const produtoRemovido = await Product.findOneAndDelete({ id_interno: idInterno });
        
        // Caso produto não seja encontrado, retorna erro 404
        if (!produtoRemovido) {
            return res.status(404).send({ 
                message: 'Produto não encontrado.' 
            });
        }

        // Retorna mensagem de sucesso na remoção
        res.status(200).send({
            message: 'Produto removido com sucesso!'
        });
        
    } catch (e) {
        // Em caso de erro retorna status 400 com dados do erro
        res.status(400).send({
            message: 'Erro ao remover produto.',
            data: e
        });
    }
};

// GET - Buscar produtos para home com paginação e filtros
controller.getHome = async (req, res) => {
    try {
        // Desestruturação dos parâmetros da query, com valores padrão diferentes dos outros métodos
        const { 
            pagina = 1, 
            limite = 15, 
            busca 
        } = req.query;

        // Converte parâmetros para números inteiros
        const paginaNum = parseInt(pagina);
        const limiteNum = parseInt(limite);
        // Calcula quantos documentos pular para paginação
        const skip = (paginaNum - 1) * limiteNum;

        // Inicializa filtro vazio
        let filtro = {};

        // Se busca for informada, cria filtro para nome e possivelmente preço
        if (busca) {
            const termoRegex = new RegExp(busca, 'i'); // Case-insensitive
            const precoNumerico = parseFloat(busca);
        
            // Busca por nome
            filtro.$or = [
                { nome: termoRegex }
            ];

            // Se busca for número válido, adiciona filtro para preço
            if (!isNaN(precoNumerico)) {
                filtro.$or.push({ preco: precoNumerico });
            }
        }    

        // Consulta produtos com filtro, ordenação, paginação
        const produtos = await Product.find(filtro)
            .sort({ nome: 1 })
            .skip(skip)
            .limit(limiteNum);

        // Conta total de produtos para calcular total de páginas
        const total = await Product.countDocuments(filtro);
        const totalPaginas = Math.ceil(total / limiteNum);

        // Envia resposta com produtos e dados da paginação
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
        // Em caso de erro, retorna status 400 com mensagem e dados do erro
        res.status(400).send({
            message: 'Erro ao buscar produtos.',
            data: e
        });
    }
};

// GET - Buscar produto específico com produtos semelhantes
controller.getPage = async (req, res) => {
    try {
        // Obtém id_interno da URL
        const { id_interno } = req.params;
        
        // Converte para número inteiro
        const idInterno = parseInt(id_interno);
        
        // Validação do id
        if (isNaN(idInterno) || idInterno <= 0) {
            return res.status(400).send({ 
                message: 'ID interno deve ser um número inteiro positivo.' 
            });
        }

        // Busca o produto específico
        const produto = await Product.findOne({ id_interno: idInterno });
        
        // Se não encontrado, retorna 404
        if (!produto) {
            return res.status(404).send({ 
                message: 'Produto não encontrado.' 
            });
        }

        // Busca todos os produtos exceto o atual, ordenados por preço crescente
        const todosProdutos = await Product.find({ 
            id_interno: { $ne: idInterno } 
        }).sort({ preco: 1 });

        // Preço do produto atual
        const precoAtual = produto.preco;
        // Encontra a posição para inserção do preço atual entre os produtos ordenados
        let posicaoAtual = todosProdutos.findIndex(p => p.preco >= precoAtual);
        
        // Se preço atual for maior que todos os outros, coloca no final da lista
        if (posicaoAtual === -1) {
            posicaoAtual = todosProdutos.length;
        }

        // Array para armazenar produtos semelhantes
        const semelhantes = [];
        const totalDesejado = 6;
        
        // Calcula quantos produtos existem antes e depois da posição encontrada
        const disponivelAntes = posicaoAtual;
        const disponivelDepois = todosProdutos.length - posicaoAtual;
        
        // Inicialmente tenta pegar 3 produtos antes e 3 depois
        let elementosAntes = Math.min(3, disponivelAntes);
        let elementosDepois = Math.min(3, disponivelDepois);
        
        // Ajusta a quantidade para pegar de cada lado caso um lado tenha menos produtos que 3
        if (elementosAntes < 3 && disponivelDepois > 3) {
            elementosDepois = Math.min(totalDesejado - elementosAntes, disponivelDepois);
        } else if (elementosDepois < 3 && disponivelAntes > 3) {
            elementosAntes = Math.min(totalDesejado - elementosDepois, disponivelAntes);
        }
        
        // Adiciona os produtos anteriores ao preço atual
        const inicioAntes = Math.max(0, posicaoAtual - elementosAntes);
        for (let i = inicioAntes; i < posicaoAtual; i++) {
            semelhantes.push(todosProdutos[i]);
        }
        
        // Adiciona os produtos posteriores ao preço atual
        const fimDepois = Math.min(todosProdutos.length, posicaoAtual + elementosDepois);
        for (let i = posicaoAtual; i < fimDepois; i++) {
            semelhantes.push(todosProdutos[i]);
        }

        // Retorna o produto solicitado e até 6 produtos semelhantes encontrados
        res.status(200).send({
            produto,
            produtosSemelhantes: semelhantes.slice(0, 6)
        });

    } catch (e) {
        // Em caso de erro, retorna status 400 e detalhes do erro
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
        
        // Valida se o array de IDs foi enviado e contém ao menos um elemento
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).send({ 
                message: 'Array de IDs é obrigatório e deve conter pelo menos um ID.' 
            });
        }

        // Valida se todos os IDs são números inteiros positivos
        for (let id of ids) {
            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).send({ 
                    message: 'Todos os IDs devem ser números inteiros positivos.' 
                });
            }
        }

        // Busca produtos que tenham id_interno dentro do array ids
        const produtos = await Product.find({ 
            id_interno: { $in: ids } 
        });

        // Retorna os produtos encontrados e a quantidade total
        res.status(200).send({
            produtos,
            total: produtos.length
        });
        
    } catch (e) {
        // Em caso de erro retorna status 400 com dados do erro
        res.status(400).send({
            message: 'Erro ao buscar produtos do carrinho.',
            data: e
        });
    }
};

// POST - Processar pagamento e limpar carrinho
controller.postPagamento = async (req, res) => {
    try {
        // Desestruturação dos dados do corpo da requisição
        const { 
            usuario_token,
            carrinho = [],
            valores,
            pagamento
        } = req.body;
        
        // Validação do token do usuário
        if (!usuario_token) {
            return res.status(400).send({ 
                message: 'Token do usuário é obrigatório para processar pagamento.'
            });
        }

        // Busca o usuário pelo token fornecido
        const usuarioExistente = await User.findOne({ token: usuario_token });
        if (!usuarioExistente) {
            return res.status(404).send({ 
                message: 'Usuário não encontrado.' 
            });
        }

        // Validação do carrinho (deve ser array com ao menos um item)
        if (!carrinho || !Array.isArray(carrinho) || carrinho.length === 0) {
            return res.status(400).send({ 
                message: 'Carrinho é obrigatório e deve conter pelo menos um item.' 
            });
        }

        // Validação dos valores de pagamento (total deve ser número positivo)
        if (!valores || typeof valores.total !== 'number' || valores.total <= 0) {
            return res.status(400).send({ 
                message: 'Valores de pagamento são obrigatórios e o total deve ser positivo.' 
            });
        }

        // Validação dos dados completos do cartão
        if (!pagamento || !pagamento.numero_cartao || !pagamento.nome_cartao || 
            !pagamento.data_vencimento || !pagamento.cvc) {
            return res.status(400).send({ 
                message: 'Dados completos do cartão são obrigatórios.' 
            });
        }

        // Extrai os ids dos produtos do carrinho para validação de estoque
        const idsCarrinho = carrinho.map(item => item.id);
        // Busca os produtos no banco para verificar estoque
        const produtos = await Product.find({ 
            id_interno: { $in: idsCarrinho } 
        });

        // Valida se cada item do carrinho tem produto existente e estoque suficiente
        for (let itemCarrinho of carrinho) {
            const produto = produtos.find(p => p.id_interno === itemCarrinho.id);
            
            if (!produto) {
                return res.status(400).send({ 
                    message: `Produto com ID ${itemCarrinho.id} não encontrado.` 
                });
            }

            // Verifica se o tamanho do produto está disponível
            const tamanhoIndex = produto.tamanhos.indexOf(itemCarrinho.tamanho);
            if (tamanhoIndex === -1) {
                return res.status(400).send({ 
                    message: `Tamanho ${itemCarrinho.tamanho} não disponível para o produto ${produto.nome}.` 
                });
            }

            // Verifica se a quantidade em estoque é suficiente
            if (produto.quantidade[tamanhoIndex] < itemCarrinho.quantidade) {
                return res.status(400).send({ 
                    message: `Estoque insuficiente para o produto ${produto.nome} no tamanho ${itemCarrinho.tamanho}.` 
                });
            }
        }

        // Atualiza o estoque de cada produto no banco subtraindo a quantidade vendida
        for (let itemCarrinho of carrinho) {
            const produto = produtos.find(p => p.id_interno === itemCarrinho.id);
            const tamanhoIndex = produto.tamanhos.indexOf(itemCarrinho.tamanho);
            
            // Cria nova array de quantidades atualizada
            const novaQuantidade = [...produto.quantidade];
            // Atualiza a quantidade para refletir a venda, garantindo que não fique negativo
            novaQuantidade[tamanhoIndex] = Math.max(0, novaQuantidade[tamanhoIndex] - itemCarrinho.quantidade);
            
            // Salva a nova quantidade no banco
            await Product.findOneAndUpdate(
                { id_interno: itemCarrinho.id },
                { quantidade: novaQuantidade },
                { new: true }
            );
        }

        // Limpa o carrinho do usuário no banco após o pagamento
        await User.findOneAndUpdate(
            { token: usuario_token },
            {
                carrinho: [],
                tamanhoCarrinho: [],
                quantiaCarrinho: []
            },
            { new: true }
        );

        // Aqui poderia vir a integração com o gateway de pagamento - atualmente simula sucesso
        
        // Retorna resposta de sucesso com detalhes da transação
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
        // Em caso de erro retorna status 400 com dados do erro
        res.status(400).send({
            message: 'Erro ao processar pagamento.',
            data: e
        });
    }
};

// POST - Adicionar múltiplos produtos
controller.productsLote = async (req, res) => {
    try {
        // Recebe array de produtos no corpo da requisição
        const produtos = req.body;
 
        // Valida se o corpo é um array e não está vazio
        if (!Array.isArray(produtos) || produtos.length < 1) {
            return res.status(400).send({ message: 'Envie um array de produtos.' });
        }
 
        const resultados = [];
        // Itera sobre os produtos para salvar cada um no banco
        for (let produto of produtos) {
            const novoProduto = new Product(produto);
            await novoProduto.save();
            resultados.push(novoProduto); // Armazena os produtos criados para retorno
        }
 
        // Retorna mensagem de sucesso e os produtos criados
        res.status(201).send({
            message: `${resultados.length} produtos criados com sucesso.`,
            produtos: resultados
        });
    } catch (e) {
        // Em caso de erro, retorna status 400 com detalhes do erro
        res.status(400).send({ message: 'Erro ao criar produtos em lote.', data: e });
    }
 };
 
 // GET - Buscar todos os produtos
 controller.productsTodos = async (req, res) => {
    try {
        // Busca todos os produtos no banco ordenados por nome
        const produtos = await Product.find().sort({ nome: 1 });
        // Retorna os produtos encontrados
        res.status(200).send({ produtos });
    } catch (e) {
        // Em caso de erro retorna status 400 com dados do erro
        res.status(400).send({ message: 'Erro ao buscar todos os produtos.', data: e });
    }
 };

export default controller; // Exporta o objeto controller para uso externo
