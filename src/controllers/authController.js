const axios = require('axios');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!apiKey) {
    console.error('A variável de ambiente FIREBASE_WEB_API_KEY não está definida.');
    return res.status(500).json({ error: 'Erro de configuração no servidor.' });
  }

  const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

  try {
    const response = await axios.post(firebaseAuthUrl, {
      email,
      password,
      returnSecureToken: true,
    });
    return res.status(200).json(response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || 'Erro de autenticação.';
    return res.status(401).json({ error: errorMessage });
  }
};

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!apiKey) {
    console.error('A variável de ambiente FIREBASE_WEB_API_KEY não está definida.');
    return res.status(500).json({ error: 'Erro de configuração no servidor.' });
  }

  const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

  try {
    const response = await axios.post(firebaseAuthUrl, {
      email,
      password,
      returnSecureToken: true,
    });
    return res.status(201).json(response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || 'Erro ao registrar usuário.';
    return res.status(400).json({ error: errorMessage });
  }
};

module.exports = { login, register };