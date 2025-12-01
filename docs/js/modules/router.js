// This file exports functions for handling routing within the application.
// It manages navigation between different views.

const routes = {};

const addRoute = (path, handler) => {
    routes[path] = handler;
};

const navigateTo = (path) => {
    const handler = routes[path] || routes['/'];
    if (handler) {
        handler();
    }
};

const initRouter = () => {
    window.onpopstate = () => {
        navigateTo(window.location.pathname);
    };

    document.addEventListener('click', (event) => {
        if (event.target.matches('a')) {
            event.preventDefault();
            const path = event.target.getAttribute('href');
            window.history.pushState({}, path, window.location.origin + path);
            navigateTo(path);
        }
    });
};

export { addRoute, navigateTo, initRouter };