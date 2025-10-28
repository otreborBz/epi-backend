const express = require('express');
const router = express.Router();
const epiController = require('../controllers/epiController');

router.get('/teste', epiController.teste)

// Rota para criar um novo EPI
router.post('/', epiController.createEpi);

// Rota para buscar todos os EPIs
router.get('/', epiController.getAllEpis);

// Rota para buscar um EPI específico por ID
router.get('/:id', epiController.getEpiById);

// Rota para atualizar um EPI específico
router.put('/:id', epiController.updateEpi);

// Rota para excluir um EPI específico
router.delete('/:id', epiController.deleteEpi);



module.exports = router;