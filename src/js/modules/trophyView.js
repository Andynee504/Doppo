// src/js/modules/trophyView.js
import { navigateTo } from "./router.js";
import { setSelectedBoss } from "./selectionState.js";

export function initTrophyView() {
  const root = document.querySelector(".trophy-view");
  if (!root) return;

  const filters = root.querySelectorAll(".trophy-filter");
  const cards = root.querySelectorAll(".trophy-card");

  const applyFilter = (name) => {
    filters.forEach((btn) => {
      btn.classList.toggle(
        "trophy-filter--active",
        btn.dataset.filter === name
      );
    });

    cards.forEach((card) => {
      const type = card.dataset.type; // "solo" ou "group"
      const match = name === "all" || name === type;
      card.style.display = match ? "" : "none";
    });
  };

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filterName = btn.dataset.filter || "all";
      applyFilter(filterName);
    });
  });

  // estado inicial
  applyFilter("all");

  // clique nos desafios de GRUPO -> ir para aba grupos com boss selecionado
  cards.forEach((card) => {
    const bossId = card.dataset.bossId;
    if (!bossId) return; // solos podem não ter boss

    card.addEventListener("click", () => {
      setSelectedBoss(bossId);   // guarda o id do boss
      navigateTo("groups");      // rota já existe
    });
  });
}
