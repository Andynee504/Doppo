// src/js/modules/libraryView.js
import { openOverlay } from "./overlay.js";
import { navigateTo } from "./router.js";

export function initLibraryView() {
  const root = document.querySelector(".library-view");
  if (!root) return;

  const tags = root.querySelectorAll(".library-tag");
  const items = root.querySelectorAll(
    ".library-item:not(.library-item--add)"
  );
  const addBtn = root.querySelector("#btn-library-add-book");

  // FILTRO POR ESTANTE / TAG
  const applyFilter = (filter) => {
    tags.forEach((btn) => {
      btn.classList.toggle(
        "library-tag--active",
        btn.dataset.filter === filter
      );
    });

    items.forEach((card) => {
      const shelf = card.dataset.shelf || "all";
      const show = filter === "all" || shelf === filter;
      card.style.display = show ? "" : "none";
    });
  };

  tags.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter || "all";
      applyFilter(filter);
    });
  });

  // estado inicial: todas as estantes
  applyFilter("all");

  // clique em um livro -> vai para tela do livro (book.html)
  items.forEach((card) => {
    card.addEventListener("click", () => {
      // depois podemos usar data-book-id para carregar detalhes específicos
      navigateTo("book");
    });
  });

  // clique em "Adicionar Livro" -> overlay explicando o fluxo
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      openOverlay(`
        <div class="overlay-panel">
          <h2 style="color: var(--light);">Adicionar livro</h2>
          <p style="color: var(--light); font-size:0.8rem;">
            Nesta versão do protótipo, a função de adicionar livro
            é ilustrativa. Na versão final, aqui o usuário poderá
            buscar por título ou ISBN e escolher em qual estante
            o livro será colocado. Ao marcar como "ativo", ele
            também aparecerá na estante padrão e na tela inicial.
          </p>
        </div>
      `);
    });
  }
}
