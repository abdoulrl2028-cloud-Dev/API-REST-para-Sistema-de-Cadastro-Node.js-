require('dotenv').config();
const app = require('./src/app');
const db = require('./src/database/db');

const PORT = process.env.PORT || 3000;

// Inicializar banco de dados
db.initialize();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

// Tratamento de erro não capturado
process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejeição não tratada em:', promise, 'motivo:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Exceção não capturada:', error);
  process.exit(1);
});
