const admin = require('firebase-admin');
const path = require('path');

// Caminho para o arquivo serviceAccountKey.json
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, 'serviceAccountKey.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
  console.log('✅ Firebase Admin SDK inicializado com sucesso.');
} catch (error) {
  console.error('❌ Erro ao inicializar o Firebase Admin SDK:', error);
  process.exit(1);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
