// src/js/modules/overlay.js

let overlayRoot = null;

function getOverlayRoot() {
  if (!overlayRoot) {
    overlayRoot = document.getElementById("overlay-root");
  }
  return overlayRoot;
}

function handleBackgroundClick(e) {
  // fecha só se clicar no fundo escuro, não dentro do conteúdo
  if (e.target === overlayRoot) {
    closeOverlay();
  }
}

export function openOverlay(contentHtml) {
  const root = getOverlayRoot();
  if (!root) return;

  root.innerHTML = contentHtml;
  root.classList.remove("overlay--hidden");
  root.addEventListener("click", handleBackgroundClick);
}

export function closeOverlay() {
  const root = getOverlayRoot();
  if (!root) return;

  root.classList.add("overlay--hidden");
  root.innerHTML = "";
  root.removeEventListener("click", handleBackgroundClick);
}

/* ========== NOTIFICAÇÕES (continua como popup central) ========== */

function openNotificationsOverlay() {
  openOverlay(`
    <div class="overlay-panel">
      <h2 style="color: var(--light);">Notificações</h2>
      <p style="color: var(--light);">Você ainda não tem notificações.</p>
    </div>
  `);
}

// ========== MENU LATERAL (hambúrguer) ==========

async function openMenuOverlay() {
  const root = getOverlayRoot();
  if (!root) return;

  try {
    const response = await fetch("./components/menu.html");
    if (!response.ok) throw new Error("Erro ao carregar menu");

    const html = await response.text();

    root.innerHTML = html;
    root.classList.remove("overlay--hidden");
    root.addEventListener("click", handleBackgroundClick);
  } catch (err) {
    console.error(err);
  }
}

/* ========== CONFIGURAÇÕES (carrega settings.html) ========== */

async function openSettingsOverlay() {
  const root = getOverlayRoot();
  if (!root) return;

  try {
    const response = await fetch("./components/settings.html");
    if (!response.ok) throw new Error("Erro ao carregar configurações");

    const html = await response.text();

    // usa o mesmo mecanismo do openOverlay, mas reaproveitando lógica
    root.innerHTML = html;
    root.classList.remove("overlay--hidden");
    root.addEventListener("click", handleBackgroundClick);
  } catch (err) {
    console.error(err);
  }
}

/* ========== INICIALIZAÇÃO GERAL ========== */

export function initOverlays() {
  const notifBtn = document.getElementById("btn-notifications");
  if (notifBtn) {
    notifBtn.addEventListener("click", openNotificationsOverlay);
  }

  const settingsBtn = document.getElementById("btn-settings");
  if (settingsBtn) {
    settingsBtn.addEventListener("click", openSettingsOverlay);
  }

  const menuBtn = document.getElementById("btn-menu");
  if (menuBtn) {
    menuBtn.addEventListener("click", openMenuOverlay);
  }
}
