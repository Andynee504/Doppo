// src/js/modules/profileView.js
import { openOverlay } from "./overlay.js";

export function initProfileView() {
  const root = document.querySelector(".profile-view");
  if (!root) return;

  // ---------- TABS (Atributos / Inventário / Status) ----------
  const tabs = root.querySelectorAll(".profile-tab");
  const panels = root.querySelectorAll(".profile-tab-panel");

  const setActiveTab = (tabName) => {
    tabs.forEach((btn) => {
      btn.classList.toggle(
        "profile-tab--active",
        btn.dataset.tab === tabName
      );
    });

    panels.forEach((panel) => {
      panel.classList.toggle(
        "profile-tab-panel--active",
        panel.dataset.tabPanel === tabName
      );
    });
  };

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;
      setActiveTab(tabName);
    });
  });

  // aba padrão
  setActiveTab("stats");

  // ---------- FILTROS DO INVENTÁRIO ----------
  const invFilters = root.querySelectorAll(".profile-inventory-filter");
  if (invFilters.length > 0) {
    invFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        invFilters.forEach((b) =>
          b.classList.remove("profile-inventory-filter--active")
        );
        btn.classList.add("profile-inventory-filter--active");

        // no futuro: aqui pode filtrar os cards de inventário de verdade
      });
    });
  }

  // ---------- CTA STATUS DE LEITURA ----------
  const readingCta = root.querySelector(".profile-reading-cta");
  if (readingCta) {
    readingCta.addEventListener("click", () => {
      openOverlay(`
        <div class="overlay-panel">
          <h2 style="color: var(--light);">Detalhes de leitura</h2>
          <p style="color: var(--light); font-size:0.8rem;">
            Aqui futuramente entram gráficos por horário do dia, dia da semana,
            mês e ano, além do histórico completo de sessões de leitura.
          </p>
        </div>
      `);
    });
  }
}
