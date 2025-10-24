require('dotenv').config();
const axios = require('axios');

const authBaseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts';

const firebaseAuthRequest = async (endpoint, email, password) => {
  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!apiKey) {
    throw new Error('A variável de ambiente FIREBASE_WEB_API_KEY não está definida.');
  }

  const url = `${authBaseUrl}:${endpoint}?key=${apiKey}`;
  return axios.post(url, { email, password, returnSecureToken: true });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const response = await firebaseAuthRequest('signInWithPassword', email, password);
    return res.status(200).json(response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message || 'Erro de autenticação.';
    console.error('[LOGIN ERROR]', errorMessage);
    return res.status(401).json({ error: errorMessage });
  }
};

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const response = await firebaseAuthRequest('signUp', email, password);
    return res.status(201).json(response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message || 'Erro ao registrar usuário.';
    console.error('[REGISTER ERROR]', errorMessage);
    return res.status(400).json({ error: errorMessage });
  }
};

module.exports = { login, register };
