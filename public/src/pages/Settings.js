import { logout } from '../services/authService.js';
import dashboardHeader from '../components/dashboardHeader.js';
import store from '../state/index.js';
import { applyTheme } from '../utilities/themeManager.js';

export default class Settings {
    constructor() {
        this.docTitle = "Ajustes";
        this.user = store.state.user;
        this.header = new dashboardHeader();
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
            const themeToggle = document.querySelector("#themeToggle");

            themeToggle.addEventListener('sl-change', (event) => {
                const newTheme = event.target.value;
                applyTheme(newTheme);
            });

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
        d.querySelector('header').innerHTML = this.header.render();
        this.header.initEvents();
        d.querySelector("#app").innerHTML = this.render();
        this.initEvents();
    }
}
