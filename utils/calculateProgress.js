function calculateProgress(participants) {
  if (!participants.length) return 0;
  const total = participants.reduce((acc, p) => acc + p.progress, 0);
  return total / participants.length;
}

module.exports = calculateProgress;
