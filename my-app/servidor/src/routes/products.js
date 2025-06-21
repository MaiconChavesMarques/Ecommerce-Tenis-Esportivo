// Importa o Express para criação de rotas
import express from 'express';

// Importa o controlador com as funções que lidam com as requisições (lógica de negócio)
import controller from '../controllers/products-controller.js';

// Cria um roteador do Express para agrupar as rotas relacionadas a produtos
const router = express.Router();

/* --------------------- ROTAS PÚBLICAS --------------------- */

// Rota para página inicial ou vitrine de produtos
router.get('/home', controller.getHome);

// Rota para acessar a página de um produto específico, usando o ID interno como parâmetro de URL
router.get('/productPage/:id_interno', controller.getPage);

// Rota POST para retornar detalhes do carrinho, baseada em um array de IDs no corpo da requisição
router.post('/carrinho', controller.getCarrinho);


/* ------------------- ROTAS ADMINISTRATIVAS ------------------- */

// Rota GET para listar todos os produtos cadastrados (modo administrador)
router.get('/administrador/products', controller.getProducts);

// Rota POST para cadastrar um novo produto
router.post('/administrador/products', controller.postProducts);

// Rota PUT para atualizar um produto existente com base no ID interno
router.put('/administrador/products/:id_interno', controller.putProducts);

// Rota DELETE para remover um produto com base no ID interno
router.delete('/administrador/products/:id_interno', controller.deleteProducts);


/* --------------------- ROTA DE PAGAMENTO --------------------- */

// Rota POST para processar um pagamento (provavelmente utilizando informações de carrinho e usuário)
router.post('/pagamento', controller.postPagamento);


/* ------------------- ROTAS DE LOTE / IMPORTAÇÃO ------------------- */

// Rota POST para adicionar vários produtos de uma vez (útil para importação em massa)
router.post('/administrador/products/lote', controller.productsLote);

// Rota GET para buscar todos os produtos (sem filtros)
router.get('/administrador/products/todos', controller.productsTodos);

// Exporta o roteador para ser usado no app principal (geralmente em app.js ou index.js)
export default router;
