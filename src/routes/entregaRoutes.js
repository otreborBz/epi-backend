const express = require('express');
const router = express.Router();
const entregaController = require('../controllers/entregaController');

// Rota para registrar a entrega de um EPI a um colaborador
router.post('/', entregaController.createEntrega);

// Rota para buscar todas as entregas de um colaborador específico
router.get('/colaborador/:colaboradorId', entregaController.getEntregasByColaborador);

module.exports = router;