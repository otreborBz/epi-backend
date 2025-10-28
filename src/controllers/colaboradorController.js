const { db } = require('../config/firebase');

const createColaborador = async (req, res) => {
  try {
    const { nome, RE, data_admissao, setor, funcao } = req.body;

    if (!nome || !RE || !data_admissao || !setor || !funcao) {
      return res.status(400).json({
        error: 'Todos os campos são obrigatórios: nome, RE, data_admissao, setor, funcao.',
      });
    }

    const colaboradorData = {
      nome,
      RE,
      data_admissao,
      setor,
      funcao,
      createdAt: new Date().toISOString(),
    };

    const colaboradorRef = await db.collection('colaboradores').add(colaboradorData);

    return res.status(201).json({ id: colaboradorRef.id, ...colaboradorData });
  } catch (error) {
    console.error('Erro ao criar colaborador:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao criar colaborador.' });
  }
};

const getAllColaboradores = async (req, res) => {
  try {
    const snapshot = await db.collection('colaboradores').get();
    const colaboradores = [];
    snapshot.forEach(doc => colaboradores.push({ id: doc.id, ...doc.data() }));
    return res.status(200).json(colaboradores);
  } catch (error) {
    console.error('Erro ao buscar colaboradores:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao buscar colaboradores.' });
  }
};

const getColaboradorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('colaboradores').doc(id).get();

    if (!doc.exists) return res.status(404).json({ error: 'Colaborador não encontrado.' });

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Erro ao buscar colaborador por ID:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao buscar colaborador.' });
  }
};

const updateColaborador = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const colaboradorRef = db.collection('colaboradores').doc(id);

    await colaboradorRef.update(data);
    return res.status(200).json({ message: 'Colaborador atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao atualizar colaborador.' });
  }
};

const deleteColaborador = async (req, res) => {
  try {
    const { id } = req.params;

    const entregasSnapshot = await db.collection('entregas').where('colaboradorId', '==', id).get();
    const batch = db.batch();

    entregasSnapshot.forEach(doc => batch.delete(doc.ref));
    batch.delete(db.collection('colaboradores').doc(id));

    await batch.commit();
    return res.status(200).json({ message: 'Colaborador e seus registros de entrega foram excluídos com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir colaborador e suas entregas:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao excluir colaborador.' });
  }
};

module.exports = {
  createColaborador,
  getAllColaboradores,
  getColaboradorById,
  updateColaborador,
  deleteColaborador,
};
