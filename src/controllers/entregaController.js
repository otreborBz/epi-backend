const { db } = require('../config/firebase');

/**
 * Registra a entrega de um EPI a um colaborador e atualiza o estoque.
 */
const createEntrega = async (req, res) => {
  try {
    const { colaboradorId, epiId, quantidadeEntregue } = req.body;

    if (!colaboradorId || !epiId || !quantidadeEntregue || Number(quantidadeEntregue) <= 0) {
      return res.status(400).json({
        error: 'Os campos colaboradorId, epiId e uma quantidadeEntregue válida são obrigatórios.',
      });
    }

    const epiRef = db.collection('epis').doc(epiId);
    const colaboradorRef = db.collection('colaboradores').doc(colaboradorId);

    // Usar uma transação para garantir a consistência dos dados (atomicidade)
    const novaEntrega = await db.runTransaction(async (transaction) => {
      const epiDoc = await transaction.get(epiRef);
      if (!epiDoc.exists) {
        // Lança um erro que será pego pelo bloco catch
        throw new Error('EPI não encontrado.');
      }

      const colaboradorDoc = await transaction.get(colaboradorRef);
      if (!colaboradorDoc.exists) {
        throw new Error('Colaborador não encontrado.');
      }

      const epiData = epiDoc.data();
      const novaQuantidadeEstoque = epiData.quantidade - Number(quantidadeEntregue);

      if (novaQuantidadeEstoque < 0) {
        throw new Error(`Estoque insuficiente. Quantidade disponível: ${epiData.quantidade}.`);
      }

      // 1. Atualiza o estoque do EPI
      transaction.update(epiRef, { quantidade: novaQuantidadeEstoque });

      // 2. Cria o registro da entrega
      const entregaData = {
        colaboradorId,
        epiId,
        quantidadeEntregue: Number(quantidadeEntregue),
        dataEntrega: new Date().toISOString(),
      };
      const entregaRef = db.collection('entregas').doc();
      transaction.set(entregaRef, entregaData);

      return { id: entregaRef.id, ...entregaData };
    });

    return res.status(201).json(novaEntrega);
  } catch (error) {
    // Retorna a mensagem de erro específica da transação ou um erro genérico
    return res.status(400).json({ error: error.message || 'Erro interno do servidor ao registrar entrega.' });
  }
};

/**
 * Busca todas as entregas de EPIs para um colaborador específico.
 */
const getEntregasByColaborador = async (req, res) => {
  try {
    const { colaboradorId } = req.params;

    if (!colaboradorId) {
      return res.status(400).json({ error: 'O ID do colaborador é obrigatório.' });
    }

    const entregasSnapshot = await db.collection('entregas').where('colaboradorId', '==', colaboradorId).get();

    const entregas = [];
    entregasSnapshot.forEach(doc => {
      entregas.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(entregas);
  } catch (error) {
    console.error('Erro ao buscar entregas por colaborador:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao buscar entregas.' });
  }
};

module.exports = {
  createEntrega,
  getEntregasByColaborador,
};