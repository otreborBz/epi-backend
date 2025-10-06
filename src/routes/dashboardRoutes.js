const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Rota para buscar as estatísticas do dashboard
router.get('/stats', dashboardController.getStats);

module.exports = router;