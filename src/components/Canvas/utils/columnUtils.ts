export const columns = [
  { id: 'landing-pad', title: 'Landing Pad' },
  { id: 'col-1', title: 'P1' },
  { id: 'col-2', title: 'P2' },
  { id: 'col-3', title: 'P3' },
  { id: 'col-4', title: 'P4' },
  { id: 'col-5', title: 'P5' }
];

export const getColumnCards = (cards: any[], columnId: string) => {
  return (cards || [])
    .filter(card => card.columnId === columnId)
    .sort((a, b) => {
      const order = { title: 0, idea: 1, evidence: 2, analysis: 3 };
      return order[a.type] - order[b.type];
    });
};

export const isColumnComplete = (cards: any[], columnId: string) => {
  const columnCards = getColumnCards(cards, columnId);
  const hasIdea = columnCards.some(card => card.type === 'idea');
  const hasEvidence = columnCards.some(card => card.type === 'evidence');
  const hasAnalysis = columnCards.some(card => card.type === 'analysis');
  return hasIdea && hasEvidence && hasAnalysis;
};