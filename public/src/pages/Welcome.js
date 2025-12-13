import { loginWithGoogle } from '../services/authService.js';
import welcomeHeader from '../components/welcomeHeader.js';

export default class Welcome {
    constructor() {
        this.docTitle = "¡Crea listas y sigue tu contenido favorito!";
        this.header = new welcomeHeader();
        this.title = "¡Bienvenido a Enterlist!";
        this.desc = "Tu lista, tus reglas. Crea listas personalizadas para películas, libros, series y más. ¡Enterlist se adapta a tus gustos!";
    }

    render() {
        return `
            <h1 class="welcome-title">${this.title}</h1>
            <p class="welcome-desc">${this.desc}</p>
            <div id="googleBtn">
                <img src="/assets/img/google-logo.svg" alt="Google Logo">
                Inicia sesión con Google
            </div>
        `;
    }

    initEvents() { // Asegúrate de que este método esté definido
        const d = document;
        const btnGoogleAuth = d.querySelector("#googleBtn");

        btnGoogleAuth.addEventListener("click", async () => {
            try {
                await loginWithGoogle();
            } catch (e) {
                console.log(e);
            }
        });
    }

    initialize() {
        const d = document;
        d.querySelector("title").innerText = this.docTitle;
        d.querySelector('header').innerHTML = this.header.render();
        d.getElementById('app').innerHTML = this.render();
        this.initEvents();
    }
}
