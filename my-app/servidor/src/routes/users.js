import express from 'express';
import controller from '../controllers/users-controller.js';

const router = express.Router();

// Rotas de autenticação
router.post('/login/entrar', controller.entrar);
router.post('/login/registro', controller.registrar);

// Rotas administrativas para gerenciar usuários
router.get('/administrador/users', controller.getUsers);
router.post('/administrador/users', controller.postUsers);
router.put('/administrador/users/:token', controller.putUsers);
router.delete('/administrador/users/:token', controller.deleteUsers);

// Rotas de perfil do usuário
router.get('/perfil/:token', controller.getPerfil);
router.put('/perfil/:token', controller.putPerfil);

// Rota para carrinho do usuário
router.get('/user/carrinho/:token', controller.getCarrinho);
router.put('/user/carrinho/:token', controller.putCarrinho);

//Lote
// POST - Registrar múltiplos usuários
router.post('/administrador/users/lote', controller.usersLote);

// GET - Buscar todos os usuários
router.get('/administrador/users/todos', controller.usersTodos);

export default router;