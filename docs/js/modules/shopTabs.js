// src/js/modules/shopTabs.js
export function initShopTabs() {
  const container = document.querySelector(".fair-view");
  if (!container) return;

  const tabs = container.querySelectorAll(".fair-tab");
  const panels = container.querySelectorAll(".fair-tab-panel");

  const setActiveTab = (tabName) => {
    tabs.forEach((btn) => {
      btn.classList.toggle("fair-tab--active", btn.dataset.tab === tabName);
    });

    panels.forEach((panel) => {
      panel.classList.toggle(
        "fair-tab-panel--active",
        panel.dataset.tabPanel === tabName
      );
    });
  };

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;
      setActiveTab(tabName);
    });
  });

  // aba padrão
  setActiveTab("market");
}
