// src/js/modules/readingSession.js
import { openOverlay, closeOverlay } from "./overlay.js";
import { navigateTo } from "./router.js";

const SESSION_KEY = "doppo_reading_session";
const PROGRESS_KEY = "doppo_current_book";

// opções de livros para o overlay "Adicionar livro ativo".
// por enquanto todos usam a mesma capa, depois você troca.
const BOOK_OPTIONS = [
  {
    id: "ninguem-sai-vivo",
    title: "Ninguém Sai Vivo",
    author: "Mark Miller",
    coverSrc: "../img/bookCovers/ninguemSaiVivo.jpg",
    totalPages: 331,
    currentPage: 185,
  },
  {
    id: "livro-exemplo-2",
    title: "Livro de Exemplo 2",
    author: "Autora X",
    coverSrc: "./img/bookCovers/katabasis.jpg",
    totalPages: 240,
    currentPage: 0,
  },
  {
    id: "livro-exemplo-3",
    title: "Livro de Exemplo 3",
    author: "Autor Y",
    coverSrc: "./img/bookCovers/baratao.jpg",
    totalPages: 420,
    currentPage: 0,
  },
];

let readingSection = null;
let btnToggle = null;
let btnToggleFeed = null;
let btnAddActiveBook = null;
let btnOpenCommunity = null;
let spanPercent = null;
let spanPages = null;
let barFill = null;
let coverImg = null;
let titleEl = null;
let authorEl = null;
let feedEl = null;

let currentBookId = null;
let totalPages = 0;
let currentPage = 0;
let currentSession = null;

// -------- storage helpers --------

function loadProgress(defaultBookId, defaultTotal, defaultCurrent) {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      return {
        bookId: defaultBookId,
        totalPages: defaultTotal,
        currentPage: defaultCurrent,
      };
    }
    const data = JSON.parse(raw);
    return {
      bookId: data.bookId || defaultBookId,
      totalPages: data.totalPages ?? defaultTotal,
      currentPage: data.currentPage ?? defaultCurrent,
    };
  } catch {
    return {
      bookId: defaultBookId,
      totalPages: defaultTotal,
      currentPage: defaultCurrent,
    };
  }
}

function saveProgress(bookId, total, page) {
  const payload = {
    bookId,
    totalPages: total,
    currentPage: page,
  };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(payload));
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  currentSession = null;
}

// -------- UI helpers --------

function updateUI() {
  if (!spanPages || !spanPercent || !barFill) return;

  spanPages.textContent = `${currentPage} / ${totalPages}`;
  const pct = Math.min(100, (currentPage / totalPages) * 100);
  const pctText = pct.toFixed(2).replace(".", ",");
  spanPercent.textContent = `${pctText}%`;
  barFill.style.width = `${pct}%`;

  if (btnToggle) {
    btnToggle.textContent = currentSession ? "Parar de ler" : "Ler agora";
  }

  if (readingSection) {
    readingSection.dataset.currentPage = String(currentPage);
    readingSection.dataset.totalPages = String(totalPages);
    readingSection.dataset.bookId = currentBookId;
  }
}

function applyBookToUI(book) {
  currentBookId = book.id;
  totalPages = book.totalPages;
  currentPage = book.currentPage;

  if (coverImg) {
    coverImg.src = book.coverSrc;
    coverImg.alt = `Capa do livro ${book.title}`;
  }
  if (titleEl) titleEl.textContent = book.title;
  if (authorEl) authorEl.textContent = book.author;

  saveProgress(currentBookId, totalPages, currentPage);
  clearSession();
  updateUI();
}

// -------- fluxo de leitura --------

function startReading() {
  currentSession = {
    bookId: currentBookId,
    startTime: Date.now(),
    startPage: currentPage,
  };
  saveSession(currentSession);
  updateUI();
}

function stopReadingAskPage() {
  openOverlay(`
    <div class="overlay-panel">
      <h2 style="color: var(--light);">Em qual página você parou?</h2>
      <p style="color: var(--light); font-size:0.8rem;">
        Vamos atualizar seu progresso e registrar esta sessão de leitura.
      </p>
      <input
        id="reading-end-page"
        type="number"
        min="1"
        max="${totalPages}"
        value="${currentPage}"
        style="
          width: 100%;
          margin-top: 8px;
          padding: 6px 8px;
          border-radius: 8px;
          border: 1px solid var(--gray);
          background: var(--dark);
          color: var(--light);
        "
      />
      <button
        id="confirm-reading-end"
        class="pill-button pill-button--primary"
        style="margin-top: 12px; width: 100%;"
      >
        Salvar
      </button>
    </div>
  `);

  const input = document.getElementById("reading-end-page");
  const btnConfirm = document.getElementById("confirm-reading-end");
  if (!input || !btnConfirm) return;

  btnConfirm.addEventListener("click", () => {
    const value = parseInt(input.value, 10);

    if (!Number.isFinite(value)) {
      closeOverlay();
      clearSession();
      updateUI();
      return;
    }

    const clamped = Math.max(1, Math.min(totalPages, value));
    const pagesRead = Math.max(0, clamped - currentPage);

    // aqui depois: usar pagesRead pra xp/mana
    currentPage = clamped;
    saveProgress(currentBookId, totalPages, currentPage);

    clearSession();
    updateUI();
    closeOverlay();
  });
}

// -------- feed do livro na home --------

function toggleFeed() {
  if (!feedEl || !btnToggleFeed) return;
  const isCollapsed = feedEl.classList.contains("book-feed--collapsed");
  feedEl.classList.toggle("book-feed--collapsed", !isCollapsed);
  feedEl.setAttribute("aria-hidden", (!isCollapsed).toString());

  btnToggleFeed.textContent = isCollapsed
    ? "Esconder feed"
    : "Feed do livro";
}

// -------- overlay: escolher livro ativo --------

function openChooseActiveBook() {
  const listHtml = BOOK_OPTIONS.map(
    (b) => `
      <li>
        <button
          class="overlay-book-option"
          data-book-id="${b.id}"
          type="button"
          style="
            width: 100%;
            text-align: left;
            padding: 8px 10px;
            margin-top: 6px;
            border-radius: 10px;
            border: 1px solid var(--primary-dark);
            background: var(--gray);
            color: var(--light);
            font-size: 0.8rem;
          "
        >
          <strong>${b.title}</strong><br/>
          <span style="opacity:0.8;">${b.author}</span>
        </button>
      </li>
    `
  ).join("");

  openOverlay(`
    <div class="overlay-panel">
      <h2 style="color: var(--light);">Escolher livro ativo</h2>
      <p style="color: var(--light); font-size:0.8rem;">
        Selecione um livro para acompanhar na tela inicial. Depois integramos
        isso com a biblioteca completa.
      </p>
      <ul style="list-style:none; padding:0; margin-top:8px;">
        ${listHtml}
      </ul>
    </div>
  `);

  const buttons = document.querySelectorAll(".overlay-book-option");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.bookId;
      const book = BOOK_OPTIONS.find((b) => b.id === id);
      if (!book) return;

      applyBookToUI(book);
      closeOverlay();
    });
  });
}

// -------- init da HOME --------

export function initHomeReading() {
  readingSection = document.querySelector(".reading-section");
  if (!readingSection) return;

  const defaultBookId = readingSection.dataset.bookId || "current-book";
  const defaultTotal =
    parseInt(readingSection.dataset.totalPages, 10) || 1;
  const defaultCurrent =
    parseInt(readingSection.dataset.currentPage, 10) || 0;

  btnToggle = document.getElementById("btn-reading-toggle");
  btnToggleFeed = document.getElementById("btn-toggle-book-feed");
  btnAddActiveBook = document.getElementById("btn-add-active-book");
  btnOpenCommunity = document.getElementById("btn-open-book-community");
  spanPercent = document.getElementById("reading-percent");
  spanPages = document.getElementById("reading-pages");
  barFill = document.getElementById("reading-progress-fill");
  coverImg = document.getElementById("reading-cover-img");
  titleEl = document.getElementById("reading-title");
  authorEl = document.getElementById("reading-author");
  feedEl = document.getElementById("home-book-feed");

  if (!btnToggle || !spanPercent || !spanPages || !barFill) return;

  // carregar progresso salvo (pode ser outro livro)
  const stored = loadProgress(defaultBookId, defaultTotal, defaultCurrent);
  const matchingBook =
    BOOK_OPTIONS.find((b) => b.id === stored.bookId) ||
    BOOK_OPTIONS[0];

  currentBookId = stored.bookId;
  totalPages = stored.totalPages;
  currentPage = stored.currentPage;

  // aplica dados do livro (capa, título, autor)
  applyBookToUI({
    ...matchingBook,
    totalPages,
    currentPage,
  });

  // sessão ativa?
  const session = loadSession();
  if (session && session.bookId === currentBookId) {
    currentSession = session;
  }

  updateUI();

  // eventos
  btnToggle.addEventListener("click", () => {
    if (!currentSession) {
      startReading();
    } else {
      stopReadingAskPage();
    }
  });

  if (btnToggleFeed && feedEl) {
    btnToggleFeed.addEventListener("click", toggleFeed);
  }

  if (btnAddActiveBook) {
    btnAddActiveBook.addEventListener("click", openChooseActiveBook);
  }

  if (btnOpenCommunity) {
    btnOpenCommunity.addEventListener("click", () => {
      navigateTo("book");
    });
  }
}
