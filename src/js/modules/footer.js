const NAV_ICONS_BASE = "./img/app/icons";

function setActiveView(viewName) {
  const nav = document.querySelector(".bottom-nav");
  if (!nav) return;

  nav.querySelectorAll(".nav-item").forEach(btn => {
    const itemView = btn.dataset.view;
    const img = btn.querySelector("img[data-icon]");
    if (!img) return;

    const iconName = img.dataset.icon;
    const isActive = itemView === viewName;

    btn.classList.toggle("nav-item--active", isActive);
    img.src = `${NAV_ICONS_BASE}/${isActive ? "fill" : "empty"}/${iconName}.svg`;
  });
}

export function initFooterNav() {
  // console.log("footer: fui carregado")
  setActiveView("home");

  // clicar na bottom nav hoje só muda visualmente
  document.querySelectorAll(".bottom-nav .nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      setActiveView(view);

      // depois, quando tiver paginas/rotas:
      // aqui chama a funcao que troca de tela
      // ex: router.goTo(view):?;
    });
  });
}
