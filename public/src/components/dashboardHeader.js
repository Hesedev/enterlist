import store from '../state/index.js';
import ListForm from "../components/ListForm.js";

export default class dashboardHeader {
    constructor() {
        this.path = window.location.pathname;
        this.user = store.state.user;
        this.listForm = new ListForm(this.user);
    }

    render() {
        const user = this.user;
        if (!user) return ''; // Si no hay usuario, no renderizar nada para evitar errores

        return `
            <div class="nav container">
                <!--Logo-->
                <a href="/" data-link class="logo">
                    <img src="/assets/logos/dark-theme/enterlist-imagotipo.png" alt="Enterlist" loading="lazy">
                </a>
                ${(this.path === "/lists") ?
                `<sl-icon id="filterListsBtn" class="nav-icon" name="sliders"></sl-icon>`
                : ``}

                <!--NavBar-->
                <nav class="navbar">
                    <a href="/dashboard" data-link class="nav-link">
                        <sl-icon name="house-door"></sl-icon>
                        <span class="nav-link-title">Principal</span>
                    </a>
                    <a href="/explore/movie" data-link class="nav-link">
                        <sl-icon name="compass"></sl-icon>
                        <span class="nav-link-title">Explorar</span>
                    </a>
                    <a href="#" id="addNewList" class="nav-link">
                        <sl-icon name="plus-circle"></sl-icon>
                        <span class="nav-link-title">Nuevo</span>
                    </a>
                    <a href="/lists" data-link class="nav-link">
                        <sl-icon name="view-list"></sl-icon>
                        <span class="nav-link-title">Listas</span>
                    </a>
                    <a href="/settings" data-link class="nav-link">
                        <img src="${user.photoURL}" alt="Profile Picture" class="profile-picture"
                            loading="lazy">
                        <span class="nav-link-title">Tú</span>
                    </a>
                </nav>
            </div>

            ${this.listForm.render()}
        `;
    }

    initEvents() {
        const newListBtn = document.querySelector('#addNewList');
        const drawer = document.querySelector('.list-form');

        this.listForm.initEvents();

        newListBtn.addEventListener("click", (e) => {
            e.preventDefault();
            drawer.classList.remove("hidden");
            drawer.show();
            blockScroll();
        });

        function blockScroll() {
            document.body.style.overflow = 'hidden';
        }
    }
}
