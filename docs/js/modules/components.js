import { initFooterNav } from "./footer.js";
import { initOverlays } from "./overlay.js";
import { addRoute, navigateTo } from "./router.js";
import { initAbilityPopups } from "./abilities.js";
import { initProfileStats } from "./profileStats.js";
import { initShopTabs } from "./shopTabs.js";
import { initProfileView } from "./profileView.js";
import { initTrophyView } from "./trophyView.js";
import { initGroupView } from "./groupView.js";
import { initHomeReading } from "./readingSession.js";
import { initLibraryView } from "./libraryView.js";


async function loadComponent(containerId, url) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao carregar " + url);

        const html = await response.text();
        container.innerHTML = html;
    } catch (err) {
        console.error(err);
    }
}

async function loadView(viewName) {
    const main = document.getElementById("app-main");
    if (!main) return;

    const response = await fetch(`./components/${viewName}.html`);
    const html = await response.text();
    main.innerHTML = html;
}

function initHomeProfileLink() {
    const btn = document.querySelector(".profile-card .profile-link");
    if (!btn) return;

    btn.addEventListener("click", () => {
        navigateTo("profile");
    });
}

function registerRoutes() {
    addRoute("/", () => {
        loadView("home").then(() => {
            initProfileStats();
            initHomeProfileLink();
            initHomeReading();
        });
    });

    addRoute("home", () => {
        loadView("home").then(() => {
            initProfileStats();
            initHomeProfileLink();
            initHomeReading();
        });
    });

    addRoute("groups", () => {
        loadView("group").then(() => {
            initAbilityPopups();
            initGroupView();
        });
    })

    addRoute("cart", () => {
        loadView("fair").then(() => {
            initShopTabs();
        });
    });

    addRoute("trophy", () => {
        loadView("trophy").then(() => {
            initTrophyView();
        });
    });

    addRoute("library", () => {
        loadView("library").then(() => {
            initLibraryView();
        });
    });

    addRoute("book", () => {
        loadView("book");
    });

    addRoute("profile", () => {
        loadView("profile").then(() => {
            initProfileView();   // <<< aqui
        });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("app-header", "./components/header.html");
    await loadComponent("app-footer", "./components/footer.html");

    registerRoutes();
    navigateTo("home");

    initFooterNav();
    initOverlays();
});
