// This file initializes the app and registers the service worker.

import { initEmulator } from './modules/emulator.js';
import { initInstallPrompt } from './modules/install.js';

document.addEventListener('DOMContentLoaded', () => {
    initEmulator();
    initInstallPrompt();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('SW registered:', reg.scope))
            .catch(err => console.warn('SW registration failed:', err));
    }
});