// public/src/utilities/themeManager.js

/**
 * Aplica el tema especificado a la aplicación.
 * Guarda el tema en localStorage, actualiza el atributo data-theme del body
 * y cambia el src del logo de la aplicación.
 * @param {string} theme - El tema a aplicar ('light' o 'dark').
 */
export function applyTheme(theme) {
    const body = document.body;
    const logo = document.querySelector(".logo img");

    localStorage.setItem('theme', theme);

    if (body) {
        body.setAttribute('data-theme', theme);
    }

    if (logo) {
        logo.src = `/assets/logos/${theme}-theme/enterlist-imagotipo.png`;
    }
}

/**
 * Carga el tema inicial desde localStorage o usa 'dark' por defecto.
 */
export function loadInitialTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
}
