const User = require('../models/userModel');
const { generateToken } = require('../utils/jwt');

// Controller de Autenticação
class AuthController {
  // Registrar novo usuário
  static register(req, res) {
    try {
      const { name, email, password, phone } = req.body;

      // Validação dos campos obrigatórios
      if (!name || !email || !password) {
        return res.status(400).json({
          message: 'Nome, email e senha são obrigatórios',
          error: 'Missing required fields'
        });
      }

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: 'Email inválido',
          error: 'Invalid email format'
        });
      }

      // Validação de senha (mínimo 6 caracteres)
      if (password.length < 6) {
        return res.status(400).json({
          message: 'Senha deve ter no mínimo 6 caracteres',
          error: 'Password too short'
        });
      }

      // Criar usuário
      User.create(name, email, password, phone, (err, user) => {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({
              message: 'Email já cadastrado',
              error: 'Email already registered'
            });
          }
          return res.status(500).json({
            message: 'Erro ao registrar usuário',
            error: err.message
          });
        }

        // Gerar token JWT
        const token = generateToken(user.id, user.email);

        res.status(201).json({
          message: 'Usuário registrado com sucesso',
          user,
          token
        });
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro no servidor',
        error: error.message
      });
    }
  }

  // Fazer login
  static login(req, res) {
    try {
      const { email, password } = req.body;

      // Validação dos campos obrigatórios
      if (!email || !password) {
        return res.status(400).json({
          message: 'Email e senha são obrigatórios',
          error: 'Missing required fields'
        });
      }

      // Buscar usuário por email
      User.findByEmail(email, (err, user) => {
        if (err) {
          return res.status(500).json({
            message: 'Erro ao buscar usuário',
            error: err.message
          });
        }

        if (!user) {
          return res.status(401).json({
            message: 'Email ou senha inválidos',
            error: 'Invalid credentials'
          });
        }

        // Verificar senha
        User.verifyPassword(password, user.password, (err, isMatch) => {
          if (err) {
            return res.status(500).json({
              message: 'Erro ao verificar senha',
              error: err.message
            });
          }

          if (!isMatch) {
            return res.status(401).json({
              message: 'Email ou senha inválidos',
              error: 'Invalid credentials'
            });
          }

          // Gerar token JWT
          const token = generateToken(user.id, user.email);

          res.status(200).json({
            message: 'Login realizado com sucesso',
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone
            },
            token
          });
        });
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro no servidor',
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
