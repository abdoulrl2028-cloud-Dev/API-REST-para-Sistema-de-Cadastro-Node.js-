const { verifyToken } = require('../utils/jwt');

// Middleware de autenticação
function authMiddleware(req, res, next) {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Token não fornecido',
        error: 'No token provided'
      });
    }

    // Formato esperado: "Bearer token"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: 'Token inválido',
        error: 'Invalid token format'
      });
    }

    // Verificar token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ 
        message: 'Token expirado ou inválido',
        error: 'Token expired or invalid'
      });
    }

    // Adicionar dados do token ao request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ 
      message: 'Erro na autenticação',
      error: error.message
    });
  }
}

module.exports = authMiddleware;
