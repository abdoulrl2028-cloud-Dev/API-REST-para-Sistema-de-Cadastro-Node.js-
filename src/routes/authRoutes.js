const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rota pública - Registro
router.post('/register', AuthController.register);

// Rota pública - Login
router.post('/login', AuthController.login);

// Rota protegida - Refresh token
router.post('/refresh', authMiddleware, AuthController.refreshToken);

// Rota protegida - Logout
router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;
