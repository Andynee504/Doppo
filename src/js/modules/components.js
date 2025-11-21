import { initFooterNav } from "./footer.js";

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

document.addEventListener("DOMContentLoaded", async () => {
    // caminhos - considerando que o demo.html está em `src/` depois da build - possivel bug
    await loadComponent("app-header", "./components/header.html");
    await loadComponent("app-footer", "./components/footer.html");
    initFooterNav();
});
