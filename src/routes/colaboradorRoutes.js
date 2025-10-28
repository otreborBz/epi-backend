const express = require('express');
const router = express.Router();
const colaboradorController = require('../controllers/colaboradorController');

// Todas as rotas já são protegidas pelo middleware no app.js
router.post('/', colaboradorController.createColaborador);
router.get('/', colaboradorController.getAllColaboradores);
router.get('/:id', colaboradorController.getColaboradorById);
router.put('/:id', colaboradorController.updateColaborador);
router.delete('/:id', colaboradorController.deleteColaborador);

module.exports = router;
