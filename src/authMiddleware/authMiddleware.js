const { auth } = require('../config/firebase');

const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Token ausente' });
  }

  const idToken = header.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token inválido ou expirado:', error.message);
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports = { verifyToken };
