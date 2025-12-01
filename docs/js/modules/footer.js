import { navigateTo } from "./router.js";


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
    setActiveView("home");

    document.querySelectorAll(".bottom-nav .nav-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const view = btn.dataset.view; // cart, trophy, home, library, groups

            setActiveView(view); // atualizar ícones (empty/fill)
            navigateTo(view); // dispara a rota correspondente
        });
    });
}
