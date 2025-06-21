// Importa o Express para criar o roteador
import express from 'express';

// Importa o controlador responsável pelas operações relacionadas aos usuários
import controller from '../controllers/users-controller.js';

// Cria o roteador do Express
const router = express.Router();

/* -------------------- ROTAS DE AUTENTICAÇÃO -------------------- */

// Rota POST para login de usuário (recebe credenciais no corpo da requisição)
router.post('/login/entrar', controller.entrar);

// Rota POST para registrar novo usuário (envio de dados de cadastro)
router.post('/login/registro', controller.registrar);


/* -------------------- ROTAS ADMINISTRATIVAS -------------------- */

// Rota GET para listar todos os usuários cadastrados (modo administrador)
router.get('/administrador/users', controller.getUsers);

// Rota POST para adicionar manualmente um novo usuário pelo admin
router.post('/administrador/users', controller.postUsers);

// Rota PUT para editar um usuário com base no token (em vez de ID)
router.put('/administrador/users/:token', controller.putUsers);

// Rota DELETE para excluir um usuário com base no token
router.delete('/administrador/users/:token', controller.deleteUsers);


/* ---------------------- ROTAS DE PERFIL ---------------------- */

// Rota GET para buscar o perfil do usuário autenticado (identificado pelo token)
router.get('/perfil/:token', controller.getPerfil);

// Rota PUT para atualizar os dados do perfil do usuário autenticado
router.put('/perfil/:token', controller.putPerfil);


/* ---------------------- CARRINHO DO USUÁRIO ---------------------- */

// Rota GET para recuperar os itens do carrinho de um usuário identificado pelo token
router.get('/user/carrinho/:token', controller.getCarrinho);

// Rota PUT para atualizar os itens do carrinho do usuário
router.put('/user/carrinho/:token', controller.putCarrinho);


/* ------------------- ROTAS EM LOTE / MASSA ------------------- */

// Rota POST para registrar vários usuários de uma só vez
router.post('/administrador/users/lote', controller.usersLote);

// Rota GET para buscar todos os usuários sem filtro (pode ser útil para exportação ou depuração)
router.get('/administrador/users/todos', controller.usersTodos);


// Exporta o roteador para ser usado na aplicação principal
export default router;
