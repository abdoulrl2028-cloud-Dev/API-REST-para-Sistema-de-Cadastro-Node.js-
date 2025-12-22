const db = require('../database/db');
const bcrypt = require('bcrypt');

class User {
  // Criar novo usuário
  static create(name, email, password, phone, callback) {
    // Hash da senha
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return callback(err);
      }

      const sql = `INSERT INTO users (name, email, password, phone) 
                   VALUES (?, ?, ?, ?)`;
      
      db.run(sql, [name, email, hashedPassword, phone], function(err) {
        if (err) {
          return callback(err);
        }
        callback(null, { id: this.lastID, name, email, phone });
      });
    });
  }

  // Buscar usuário por email
  static findByEmail(email, callback) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    
    db.get(sql, [email], (err, row) => {
      if (err) {
        return callback(err);
      }
      callback(null, row);
    });
  }

  // Buscar usuário por ID
  static findById(id, callback) {
    const sql = `SELECT id, name, email, phone, created_at, updated_at FROM users WHERE id = ?`;
    
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err);
      }
      callback(null, row);
    });
  }

  // Buscar todos os usuários
  static findAll(callback) {
    const sql = `SELECT id, name, email, phone, created_at, updated_at FROM users`;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
  }

  // Atualizar usuário
  static update(id, name, email, phone, callback) {
    const sql = `UPDATE users SET name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`;
    
    db.run(sql, [name, email, phone, id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id, name, email, phone });
    });
  }

  // Deletar usuário
  static delete(id, callback) {
    const sql = `DELETE FROM users WHERE id = ?`;
    
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { message: 'Usuário deletado com sucesso' });
    });
  }

  // Verificar senha
  static verifyPassword(plainPassword, hashedPassword, callback) {
    bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
      if (err) {
        return callback(err);
      }
      callback(null, isMatch);
    });
  }
}

module.exports = User;
