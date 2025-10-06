const admin = require('firebase-admin');

// O SDK irá procurar a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS
// que você definiu no seu arquivo .env para encontrar o serviceAccountKey.json
try {
  admin.initializeApp();
  console.log('✅ Firebase Admin SDK inicializado com sucesso.');
} catch (error) {
  console.error('Erro ao inicializar o Firebase Admin SDK:', error);
  // Se a inicialização falhar, o aplicativo não deve continuar.
  process.exit(1);
}

const db = admin.firestore();
module.exports = { admin, db };