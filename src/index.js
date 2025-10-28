require('dotenv').config();
require('./config/firebase'); // Inicializa Firebase Admin

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { verifyToken } = require('./authMiddleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const epiRoutes = require('./routes/epiRoutes');
const colaboradorRoutes = require('./routes/colaboradorRoutes');
const entregaRoutes = require('./routes/entregaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Limite de requisições
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas requisições vindas deste IP, por favor tente novamente após 15 minutos.',
}));

// Rota pública de teste
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API EPI-Backend está funcionando!' });
});

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas com token Firebase
app.use('/api/epis', verifyToken, epiRoutes);
app.use('/api/colaboradores', verifyToken, colaboradorRoutes);
app.use('/api/entregas', verifyToken, entregaRoutes);
app.use('/api/dashboard', verifyToken, dashboardRoutes);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

module.exports = app;
