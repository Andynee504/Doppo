// src/js/modules/groupView.js
import { consumeSelectedBoss } from "./selectionState.js";

export function initGroupView() {
  const root = document.querySelector(".group-view");
  if (!root) return;

  const cards = root.querySelectorAll(".boss-card");

  const openCard = (targetId) => {
    cards.forEach((card) => {
      const body = card.querySelector(".boss-card-body");
      const isTarget = card.dataset.bossId === targetId;

      card.classList.toggle("boss-card--open", isTarget);
      if (body) {
        body.classList.toggle("boss-card-body--open", isTarget);
      }
    });
  };

  // comportamento de toggle ao clicar no header
  cards.forEach((card) => {
    const header = card.querySelector(".boss-card-header");
    const body = card.querySelector(".boss-card-body");
    if (!header || !body) return;

    header.addEventListener("click", () => {
      const isOpen = card.classList.contains("boss-card--open");
      if (isOpen) {
        card.classList.remove("boss-card--open");
        body.classList.remove("boss-card-body--open");
      } else {
        const id = card.dataset.bossId;
        openCard(id);
      }
    });
  });

  // se viemos da tela de Troféus com um boss selecionado
  const selectedBossId = consumeSelectedBoss();
  if (selectedBossId) {
    openCard(selectedBossId);
  }
}
