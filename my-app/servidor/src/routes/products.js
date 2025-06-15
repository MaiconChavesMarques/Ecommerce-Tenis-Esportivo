import express from 'express';
import controller from '../controllers/products-controller.js';

const router = express.Router();

// Rotas públicas
router.get('/home', controller.getHome);
router.get('/productPage/:id_interno', controller.getPage); // Mudança: parâmetro na URL
router.post('/carrinho', controller.getCarrinho); // Mantém POST pois precisa de array de IDs

// Rotas administrativas
router.get('/administrador/products', controller.getProducts);
router.post('/administrador/products', controller.postProducts);
router.put('/administrador/products/:id_interno', controller.putProducts); // Mudança: parâmetro na URL
router.delete('/administrador/products/:id_interno', controller.deleteProducts); // Mudança: parâmetro na URL

// Rota de pagamento
router.post('/pagamento', controller.postPagamento);

//Lote
// POST - Adicionar múltiplos produtos
router.post('/administrador/products/lote', controller.productsLote);

// GET - Buscar todos os produtos
router.get('/administrador/products/todos', controller.productsTodos);

export default router;