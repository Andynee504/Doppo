import { openOverlay } from "./overlay.js";

function openManaInfoPopup() {
  openOverlay(`
    <div class="overlay-panel">
      <h2 style="color: var(--light);">Mana</h2>
      <p style="color: var(--light); font-size:0.8rem;">
        Você recupera <strong>1 ponto de mana</strong> a cada
        <strong>X páginas lidas</strong>.<br/>
        Esta semana você já gerou <strong>Y mana</strong> lendo.
      </p>
    </div>
  `);
}

export function initProfileStats() {
  const manaStat = document.getElementById("stat-mana");
  if (!manaStat) return;
  manaStat.addEventListener("click", openManaInfoPopup);
}
