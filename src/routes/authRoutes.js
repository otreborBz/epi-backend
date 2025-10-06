const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para login de usuário
router.post('/login', authController.login);

// Rota para registrar um novo usuário
router.post('/register', authController.register);

module.exports = router;