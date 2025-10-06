const { db } = require('../config/firebase');

/**
 * Gera estatísticas consolidadas para o dashboard.
 */
const getStats = async (req, res) => {
  try {
    // Usar Promise.all para buscar dados de múltiplas coleções em paralelo
    const [episSnapshot, colaboradoresSnapshot, entregasSnapshot] = await Promise.all([
      db.collection('epis').get(),
      db.collection('colaboradores').get(),
      db.collection('entregas').get(),
    ]);

    // --- Cálculo das Estatísticas de EPIs ---
    let totalEpisDisponiveis = 0;
    let episVencendo = 0;
    let episEmFalta = 0;
    const hoje = new Date();
    const dataLimiteVencimento = new Date();
    dataLimiteVencimento.setDate(hoje.getDate() + 30); // Considera EPIs vencendo nos próximos 30 dias

    const epis = [];
    episSnapshot.forEach(doc => {
      const epi = { id: doc.id, ...doc.data() };
      epis.push(epi);

      totalEpisDisponiveis += epi.quantidade;
      if (epi.quantidade <= 0) {
        episEmFalta++;
      }
      const dataValidade = new Date(epi.validade);
      if (dataValidade > hoje && dataValidade <= dataLimiteVencimento) {
        episVencendo++;
      }
    });

    // --- Cálculo de Colaboradores e Entregas ---
    const entregas = [];
    const colaboradoresComEpi = new Set();
    entregasSnapshot.forEach(doc => {
      const entrega = doc.data();
      entregas.push(entrega);
      colaboradoresComEpi.add(entrega.colaboradorId);
    });

    const totalColaboradores = colaboradoresSnapshot.size;
    const colaboradoresSemEpi = totalColaboradores - colaboradoresComEpi.size;

    // --- Cálculo de EPIs Mais Utilizados ---
    const usoPorEpi = entregas.reduce((acc, entrega) => {
      acc[entrega.epiId] = (acc[entrega.epiId] || 0) + entrega.quantidadeEntregue;
      return acc;
    }, {});

    const episMaisUtilizados = Object.entries(usoPorEpi)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([epiId, quantidade]) => {
        const epi = epis.find(e => e.id === epiId);
        return { nome: epi ? epi.nome : 'EPI não encontrado', quantidade };
      });

    // --- Cálculo de Uso por Setor ---
    const colaboradoresMap = new Map();
    colaboradoresSnapshot.forEach(doc => {
      colaboradoresMap.set(doc.id, doc.data());
    });

    const usoPorSetor = entregas.reduce((acc, entrega) => {
      const colaborador = colaboradoresMap.get(entrega.colaboradorId);
      if (colaborador && colaborador.setor) {
        acc[colaborador.setor] = (acc[colaborador.setor] || 0) + entrega.quantidadeEntregue;
      }
      return acc;
    }, {});

    const usoPorSetorFormatado = Object.entries(usoPorSetor).map(([setor, quantidade]) => ({
      setor,
      quantidade,
    }));

    // Monta o objeto de resposta final
    const stats = {
      totalEpisDisponiveis,
      episVencendo,
      episEmFalta,
      colaboradoresSemEpi,
      entregasVencidas: 0, // Lógica a ser implementada
      episMaisUtilizados,
      usoPorSetor: usoPorSetorFormatado,
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Erro ao gerar estatísticas do dashboard:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao gerar estatísticas.' });
  }
};

module.exports = {
  getStats,
};