let selectedBossId = null;

export function setSelectedBoss(id) {
  selectedBossId = id;
}

export function consumeSelectedBoss() {
  const id = selectedBossId;
  selectedBossId = null; // "consome" o valor
  return id;
}
