const { admin } = require('../config/firebase');

/**
 * Middleware para verificar o token JWT do Firebase enviado no cabeçalho Authorization.
 * Se o token for válido, o usuário decodificado é adicionado a `req.user`.
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autorizado. Token não fornecido ou em formato inválido.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Verifica o token usando o Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Adiciona as informações do usuário à requisição para uso posterior
    req.user = decodedToken;

    // Continua para a próxima função (o controller da rota)
    next();
  } catch (error) {
    console.error('Erro ao verificar o token:', error);
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports = { verifyToken };