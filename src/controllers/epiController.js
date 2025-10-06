const { db } = require('../config/firebase');

/**
 * Cria um novo Equipamento de Proteção Individual (EPI) no Firestore.
 */
const createEpi = async (req, res) => {
  try {
    const { nome, ca, validade, quantidade } = req.body;

    // Validação básica dos campos recebidos
    if (!nome || !ca || !validade || quantidade === undefined) {
      return res.status(400).json({
        error: 'Todos os campos são obrigatórios: nome, ca, validade, quantidade.',
      });
    }

    const epiData = {
      nome,
      ca,
      validade, // A data de validade, ex: "2028-12-31"
      quantidade: Number(quantidade), // Garante que a quantidade seja um número
      createdAt: new Date().toISOString(),
    };

    const epiRef = await db.collection('epis').add(epiData);

    return res.status(201).json({ id: epiRef.id, ...epiData });
  } catch (error) {
    console.error('Erro ao criar EPI:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao criar EPI.' });
  }
};

/**
 * Busca todos os Equipamentos de Proteção Individual (EPIs) no Firestore.
 */
const getAllEpis = async (req, res) => {
  try {
    const episSnapshot = await db.collection('epis').get();
    const epis = [];
    episSnapshot.forEach(doc => {
      epis.push({ id: doc.id, ...doc.data() });
    });
    return res.status(200).json(epis);
  } catch (error) {
    console.error('Erro ao buscar EPIs:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao buscar EPIs.' });
  }
};

/**
 * Busca um EPI específico pelo seu ID.
 */
const getEpiById = async (req, res) => {
  try {
    const { id } = req.params;
    const epiRef = db.collection('epis').doc(id);
    const doc = await epiRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'EPI não encontrado.' });
    }

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Erro ao buscar EPI por ID:', error);
    return res
      .status(500)
      .json({ error: 'Erro interno do servidor ao buscar EPI.' });
  }
};

/**
 * Atualiza um EPI existente no Firestore.
 */
const updateEpi = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!id) {
      return res.status(400).json({ error: 'O ID do EPI é obrigatório.' });
    }

    const epiRef = db.collection('epis').doc(id);
    const doc = await epiRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'EPI não encontrado.' });
    }

    await epiRef.update(data);

    return res.status(200).json({ id, ...data });
  } catch (error) {
    console.error('Erro ao atualizar EPI:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao atualizar EPI.' });
  }
};

/**
 * Exclui um EPI do Firestore.
 */
const deleteEpi = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('epis').doc(id).delete();

    return res.status(200).json({ message: 'EPI excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir EPI:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao excluir EPI.' });
  }
};

module.exports = {
  createEpi,
  getAllEpis,
  getEpiById,
  updateEpi,
  deleteEpi,
};