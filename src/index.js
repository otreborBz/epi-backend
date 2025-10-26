// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Inicializa o Firebase Admin SDK
require('./config/firebase');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Importa o middleware de autenticação
const { verifyToken } = require('./authMiddleware/authMiddleware');
// Importa as rotas
const authRoutes = require('./routes/authRoutes');
const epiRoutes = require('./routes/epiRoutes');
const colaboradorRoutes = require('./routes/colaboradorRoutes');
const entregaRoutes = require('./routes/entregaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middlewares de segurança e utilitários
app.use(helmet()); // Adiciona cabeçalhos de segurança
app.use(cors()); // Habilita Cross-Origin Resource Sharing
app.use(morgan('dev')); // Logger de requisições HTTP
app.use(express.json()); // Parser para body de requisições JSON
app.use(express.urlencoded({ extended: true })); // Parser para body de requisições URL-encoded

// Middleware de limite de requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 requisições por janela
  standardHeaders: true, // Retorna informações do limite nos cabeçalhos `RateLimit-*`
  legacyHeaders: false, // Desabilita os cabeçalhos `X-RateLimit-*`
  message: 'Muitas requisições vindas deste IP, por favor tente novamente após 15 minutos.',
});
app.use(limiter);

// Rota de teste inicial
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API EPI-Backend está funcionando!' });
});

// --- Rotas da Aplicação ---
// Rota pública para login e registro
app.use('/api/auth', authRoutes);

// Rotas protegidas que exigem um token válido
app.use('/api/epis', verifyToken, epiRoutes);
app.use('/api/colaboradores', verifyToken, colaboradorRoutes);
app.use('/api/entregas', verifyToken, entregaRoutes);
app.use('/api/dashboard', verifyToken, dashboardRoutes);

// Porta do servidor
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;