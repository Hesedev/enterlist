import store from '../state/index.js';

const chargeTheme = () => {
    const body = document.body;
    const logo = document.querySelector(".logo img");
    const actualTheme = localStorage.getItem('theme') || 'dark';

    body.style.display = "block";
    body.setAttribute('data-theme', actualTheme);
    (logo) ? logo.src = `/assets/logos/${actualTheme}-theme/enterlist-imagotipo.png` : "";
}

const loadStyles = (stylesheets) => {
    const links = document.querySelectorAll('.dynamic-style');
    const head = document.querySelector('head');
    const app = document.querySelector('#app');

    // Remover estilos anteriores
    app.innerHTML = "";
    links.forEach(link => link.remove());

    // Agregar nuevos estilos y esperar a que carguen
    const promises = stylesheets.map((stylesheet) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = stylesheet;
        link.className = 'dynamic-style';
        head.appendChild(link);

        return new Promise(resolve => {
            link.onload = resolve;
        });
    });

    return Promise.all(promises);
};

const matchRoute = (path, routePath) => {
    const [basePath, queryString] = path.split('?');
    const pathSegments = basePath.split('/').filter(Boolean);
    const routeSegments = routePath.split('/').filter(Boolean);
    const params = {};
    const queryParams = {};

    if (pathSegments.length !== routeSegments.length) return null;

    for (let i = 0; i < routeSegments.length; i++) {
        if (routeSegments[i].startsWith(':')) {
            const paramName = routeSegments[i].slice(1);
            params[paramName] = pathSegments[i];
        } else if (routeSegments[i] !== pathSegments[i]) {
            return null;
        }
    }

    if (queryString) {
        queryString.split('&').forEach(param => {
            const [key, value] = param.split('=');
            queryParams[key] = decodeURIComponent(value || '');
        });
    }
    return { params, queryParams };
};

export const router = async (routes) => {
    const user = store.state.user;
    const path = window.location.pathname + window.location.search;
    let route = null;
    let matchedRoute = null;

    for (const r of routes) {
        matchedRoute = matchRoute(path, r.path);
        if (matchedRoute) {
            route = r;
            break;
        }
    }

    if (!route) {
        window.history.pushState(null, '', '/404');
        route = routes.find(r => r.path === '/404');
    }

    const params = matchedRoute ? matchedRoute.params : {};
    const queryParams = matchedRoute ? matchedRoute.queryParams : {};

    if (user) {
        if (path === '/') {
            window.history.pushState({}, '', '/dashboard');
            route = routes.find(r => r.path === '/dashboard');
        }
    } else {
        if (route.requiresAuth) {
            window.history.pushState({}, '', '/');
            route = routes.find(r => r.path === '/');
        }
    }

    document.querySelector("#preloader").classList.remove("hidden");

    try {
        await loadStyles(route.styles);
        const module = await route.page();
        const PageClass = module.default;
        const pageInstance = new PageClass(params, queryParams);

        await Promise.all([
            pageInstance.initialize(),
            chargeTheme()
        ]);

        document.querySelector("#preloader").classList.add("hidden");

        const dataLinks = document.querySelectorAll('[data-link]');
        Array.from(dataLinks).find(link =>
            window.location.pathname === new URL(link.href).pathname)?.classList.add('nav-active');

        const dialogs = document.querySelectorAll("sl-dialog");
        dialogs.forEach(d => {
            d.addEventListener("sl-show", () => {
                document.body.style.overflow = "hidden";
            });

            d.addEventListener("sl-hide", () => {
                document.body.style.overflow = "auto";
            });
        });
    } catch (error) {
        console.error("Error loading page:", error);
        document.querySelector("#preloader").classList.add("hidden");
    }
};
