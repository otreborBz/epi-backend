const express = require('express');
const router = express.Router();
const colaboradorController = require('../controllers/colaboradorController');

// Rota para criar um novo colaborador
router.post('/', colaboradorController.createColaborador);

// Rota para buscar todos os colaboradores
router.get('/', colaboradorController.getAllColaboradores);

// Rota para buscar um colaborador por ID
router.get('/:id', colaboradorController.getColaboradorById);

// Rota para atualizar um colaborador
router.put('/:id', colaboradorController.updateColaborador);

// Rota para excluir um colaborador
router.delete('/:id', colaboradorController.deleteColaborador);

module.exports = router;