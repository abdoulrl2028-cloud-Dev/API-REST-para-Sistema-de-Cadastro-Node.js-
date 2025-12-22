const User = require('../models/userModel');

// Controller de Usuários
class UserController {
  // Obter perfil do usuário autenticado
  static getProfile(req, res) {
    try {
      const userId = req.user.userId;

      User.findById(userId, (err, user) => {
        if (err) {
          return res.status(500).json({
            message: 'Erro ao buscar usuário',
            error: err.message
          });
        }

        if (!user) {
          return res.status(404).json({
            message: 'Usuário não encontrado',
            error: 'User not found'
          });
        }

        res.status(200).json({
          message: 'Perfil do usuário obtido com sucesso',
          user
        });
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro no servidor',
        error: error.message
      });
    }
  }

  // Listar todos os usuários
  static getAllUsers(req, res) {
    try {
      User.findAll((err, users) => {
        if (err) {
          return res.status(500).json({
            message: 'Erro ao listar usuários',
            error: err.message
          });
        }

        res.status(200).json({
          message: 'Usuários listados com sucesso',
          total: users ? users.length : 0,
          users: users || []
        });
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro no servidor',
        error: error.message
      });
    }
  }

  // Obter usuário por ID
  static getUserById(req, res) {
    try {
      const { id } = req.params;

      // Validação de ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          message: 'ID inválido',
          error: 'Invalid user ID'
        });
      }

      User.findById(id, (err, user) => {
        if (err) {
          return res.status(500).json({
            message: 'Erro ao buscar usuário',
            error: err.message
          });
        }

        if (!user) {
          return res.status(404).json({
            message: 'Usuário não encontrado',
            error: 'User not found'
          });
        }

        res.status(200).json({
          message: 'Usuário obtido com sucesso',
          user
        });
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro no servidor',
        error: error.message
      });
    }
  }

  // Atualizar usuário
  static updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;

      // Validação de ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          message: 'ID inválido',
          error: 'Invalid user ID'
        });
      }

      // Validação dos campos obrigatórios
      if (!name || !email) {
        return res.status(400).json({
          message: 'Nome e email são obrigatórios',
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

      // Atualizar usuário
      User.update(id, name, email, phone, (err, user) => {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({
              message: 'Email já cadastrado',
              error: 'Email already in use'
            });
          }
          return res.status(500).json({
            message: 'Erro ao atualizar usuário',
            error: err.message
          });
        }

        res.status(200).json({
          message: 'Usuário atualizado com sucesso',
          user
        });
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro no servidor',
        error: error.message
      });
    }
  }

  // Deletar usuário
  static deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Validação de ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          message: 'ID inválido',
          error: 'Invalid user ID'
        });
      }

      // Deletar usuário
      User.delete(id, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'Erro ao deletar usuário',
            error: err.message
          });
        }

        res.status(200).json({
          message: 'Usuário deletado com sucesso',
          result
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

module.exports = UserController;
