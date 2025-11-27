import { openOverlay, closeOverlay } from "./overlay.js";

function buildPagePopupHtml(bookTitle, currentPage, totalPages) {
  const safeCurrent = currentPage ?? "";
  return `
    <div class="overlay-panel">
      <h2 style="color: var(--light);">Em qual página você parou?</h2>
      <p style="color: var(--light); font-size:0.8rem; opacity:0.85;">
        Livro: <strong>${bookTitle}</strong><br/>
        Digite a página atual para atualizar seu progresso.
      </p>

      <label style="display:block; margin-top:8px; color:var(--light); font-size:0.8rem;">
        Página atual
        <input
          id="reading-current-page"
          type="number"
          min="1"
          max="${totalPages}"
          value="${safeCurrent}"
          style="width:100%; margin-top:4px; padding:6px 8px; border-radius:8px; border:none; background:var(--gray); color:var(--light);"
        />
      </label>

      <button
        id="reading-save-progress"
        class="pill-button pill-button--primary"
        style="margin-top:12px;"
      >
        Salvar
      </button>
    </div>
  `;
}

export function initReadingInteractions() {
  const view = document.querySelector(".book-view");
  if (!view) return;

  const bookId = view.dataset.bookId;
  const totalPages = Number(view.dataset.totalPages || "0");
  const titleEl = view.querySelector(".book-title");
  const bookTitle = titleEl ? titleEl.textContent.trim() : "Livro";

  const btnProgress = document.getElementById("btn-book-progress");
  if (btnProgress) {
    btnProgress.addEventListener("click", () => {
      // aqui você poderia buscar o progresso salvo da storage
      const currentPage = null;

      openOverlay(
        buildPagePopupHtml(bookTitle, currentPage, totalPages)
      );

      const saveBtn = document.getElementById("reading-save-progress");
      if (saveBtn) {
        saveBtn.addEventListener("click", () => {
          const input = document.getElementById("reading-current-page");
          const value = Number(input.value || "0");

          // TODO: salvar value (ex: localStorage ou API)
          // TODO: atualizar barra de progresso e texto na book-view / home

          closeOverlay();
        });
      }
    });
  }

  const btnReadNow = document.getElementById("btn-read-now");
  if (btnReadNow) {
    btnReadNow.addEventListener("click", () => {
      // aqui você pode iniciar um timer de leitura (futuro)
      // MVP: só mostra um aviso rápido
      openOverlay(`
        <div class="overlay-panel">
          <h2 style="color: var(--light);">Leitura iniciada</h2>
          <p style="color: var(--light); font-size:0.8rem;">
            Quando terminar, clique no progresso do livro para informar
            em qual página parou.
          </p>
        </div>
      `);
      setTimeout(() => {
        closeOverlay();
      }, 2000);
    });
  }
}
