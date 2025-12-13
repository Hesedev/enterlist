import { router } from './router/router.js';
import { routes } from './router/routes.js';
import store from './state/index.js';
import { registerIconLibrary } from 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.18.0/cdn/utilities/icon-library.js';

registerIconLibrary('boxicons', {
    resolver: name => {
        let folder = 'regular';
        if (name.substring(0, 4) === 'bxs-') folder = 'solid';
        if (name.substring(0, 4) === 'bxl-') folder = 'logos';
        return `https://cdn.jsdelivr.net/npm/boxicons@2.0.5/svg/${folder}/${name}.svg`;
    },
    mutator: svg => svg.setAttribute('fill', 'currentColor')
});

window.addEventListener("load", () => {
    window.addEventListener('popstate', () => {
        router(routes);
    });

    window.addEventListener('hashchange', () => {
        router(routes);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const d = document;

    // Se suscribe a los cambios en el estado del usuario.
    // El router se ejecutará cada vez que el estado de autenticación cambie.
    store.subscribe('user', (user) => {
        router(routes);
    });

    // Inicia el proceso de escucha del estado de autenticación.
    store.dispatch('checkAuthState');

    d.addEventListener('click', (e) => {
        const target = e.target.closest('a[data-link]');
        if (target) {
            e.preventDefault();
            window.history.pushState({}, '', target.href);
            router(routes);
        }
    });

    d.body.addEventListener("error", (event) => {
        if (event.target.tagName === "IMG") {
            console.error(`Error al cargar imagen:`, event.target.src);
            event.target.src = "/assets/img/no-image-found.jpg";
        }
    }, true);
});
