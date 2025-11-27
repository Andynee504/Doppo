// js/modules/abilities.js
const LONG_PRESS_MS = 500;

let longPressTimer = null;
let overlayRoot = null;

function getOverlayRoot() {
  if (!overlayRoot) {
    overlayRoot = document.getElementById("overlay-root");
  }
  return overlayRoot;
}

function showAbilityPopup(btn) {
  const root = getOverlayRoot();
  if (!root) return;

  const name = btn.dataset.abilityName;
  const desc = btn.dataset.abilityDesc;
  const cost = btn.dataset.abilityCost;

  root.innerHTML = `
    <div class="overlay-panel">
      <h2>${name}</h2>
      <p>${desc}</p>
      <p><strong>Custo:</strong> ${cost}</p>
      <button id="close-ability-popup" class="pill-button pill-button--secondary" style="margin-top:12px;">
        Fechar
      </button>
    </div>
  `;

  root.classList.remove("overlay--hidden");

  document
    .getElementById("close-ability-popup")
    ?.addEventListener("click", hideAbilityPopup);

  // fechar clicando fora
  root.addEventListener("click", onOverlayBackgroundClick);
}

function hideAbilityPopup() {
  const root = getOverlayRoot();
  if (!root) return;

  root.classList.add("overlay--hidden");
  root.innerHTML = "";
  root.removeEventListener("click", onOverlayBackgroundClick);
}

function onOverlayBackgroundClick(e) {
  if (e.target === overlayRoot) {
    hideAbilityPopup();
  }
}

export function initAbilityPopups() {
  const main = document.getElementById("app-main");
  if (!main) return;

  // hover (desktop)
  main.addEventListener("mouseenter", e => {
    const btn = e.target.closest(".ability-chip");
    if (!btn) return;
    showAbilityPopup(btn);
  }, true);

  main.addEventListener("mouseleave", e => {
    if (e.target.closest && e.target.closest(".ability-chip")) {
      hideAbilityPopup();
    }
  }, true);

  // clique simples (mobile/desktop)
  main.addEventListener("click", e => {
    const btn = e.target.closest(".ability-chip");
    if (!btn) return;
    showAbilityPopup(btn);
  });

  // long press básico (mobile)
  main.addEventListener("pointerdown", e => {
    const btn = e.target.closest(".ability-chip");
    if (!btn) return;
    clearTimeout(longPressTimer);
    longPressTimer = setTimeout(() => showAbilityPopup(btn), LONG_PRESS_MS);
  });

  main.addEventListener("pointerup", () => {
    clearTimeout(longPressTimer);
  });

  main.addEventListener("pointercancel", () => {
    clearTimeout(longPressTimer);
  });
}
