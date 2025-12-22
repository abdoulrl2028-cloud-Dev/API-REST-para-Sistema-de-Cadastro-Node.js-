const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rota protegida - Obter perfil do usuário autenticado
router.get('/profile', authMiddleware, UserController.getProfile);

// Rota protegida - Listar todos os usuários
router.get('/', authMiddleware, UserController.getAllUsers);

// Rota protegida - Obter usuário por ID
router.get('/:id', authMiddleware, UserController.getUserById);

// Rota protegida - Atualizar usuário
router.put('/:id', authMiddleware, UserController.updateUser);

// Rota protegida - Deletar usuário
router.delete('/:id', authMiddleware, UserController.deleteUser);

module.exports = router;
