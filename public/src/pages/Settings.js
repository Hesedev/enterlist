import { logout } from '../services/authService.js';
import dashboardHeader from '../components/dashboardHeader.js';

export default class Settings {
    constructor(user) {
        this.docTitle = "Ajustes";
        this.header = new dashboardHeader(user);
        this.user = user;
        this.theme = localStorage.getItem('theme') || 'dark';
    }

    render() {
        return `
            <div class="settings-container">
                <div class="settings-group">
                    <div class="profile-background"></div>
                    <div class="profile-wrapper">
                        <img src="${this.user.photoURL}" alt="Profile Picture"
                            class="profile-picture-settings" loading="lazy">
                        <div class="profile-info">
                            <h3>${this.user.displayName}</h3>
                            <span>${this.user.email}</span>
                            ${(this.user.providerData[0].providerId === 'google.com') ? `
                                <a href="https://myaccount.google.com/">
                                    Administrar cuenta de Google
                                </a>` : `<a href="https://myaccount.google.com/">
                                    Editar perfil <sl-icon name="pen"></sl-icon>
                                </a>`}
                        </div>
                    </div>
                </div>
                <div class="settings-group">
                    <div class="preferences-wrapper">
                        <h3>Preferencias</h3>
                        <div class="appearance-wrapper">
                            <span>Tema</span>
                            <sl-radio-group id="themeToggle" size="large" name="apariencia" value="${this.theme}">
                                <sl-radio-button value="light">Claro</sl-radio-button>
                                <sl-radio-button value="dark">Oscuro</sl-radio-button>
                            </sl-radio-group>
                        </div>
                    </div>
                </div>

                <sl-button id="logoutBtn" class="btn btn-danger">
                    <sl-icon slot="suffix" name="box-arrow-up-right"></sl-icon>
                    Cerrar sesión
                </sl-button>
            </div>
            `;
    }

    initEvents() {

        try {
            const btnLogout = document.querySelector("#logoutBtn");
            const body = document.body;
            const darkThemeToggle = document.querySelector('sl-radio-button[value="dark"]');
            const lightThemeToggle = document.querySelector('sl-radio-button[value="light"]');

            darkThemeToggle.addEventListener('sl-focus', () => {
                const theme = darkThemeToggle.getAttribute("value");
                const logo = document.querySelector(".logo img");
                (logo) ? logo.src = `/assets/logos/${theme}-theme/enterlist-imagotipo.png` : "";
                body.setAttribute('data-theme', theme);


                localStorage.setItem('theme', theme);
            })

            lightThemeToggle.addEventListener('sl-focus', () => {
                const theme = lightThemeToggle.getAttribute("value");
                const logo = document.querySelector(".logo img");
                (logo) ? logo.src = `/assets/logos/${theme}-theme/enterlist-imagotipo.png` : "";
                body.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
            })

            btnLogout.addEventListener("click", async () => {
                try {
                    await logout();
                } catch (e) {
                    console.log(e);
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    initialize() {
        const d = document;
        d.querySelector("title").innerText = this.docTitle;
        d.querySelector('header').innerHTML = this.header.render(this.user);
        this.header.initEvents();
        d.querySelector("#app").innerHTML = this.render();
        this.initEvents();
    }
}