import { router } from '../router/router.js';
import { routes } from '../router/routes.js';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export default class searchHeader {
    constructor(query, page) {
        this.page = page;
        this.type = page.type;
        this.query = (query) ? query : "";
        this.path = window.location.pathname;
        this.list = page.list;
    }

    render() {
        return `
            <div class="nav container search-header">
                <sl-icon id="backBtn" class="nav-icon" name="arrow-left"></sl-icon>
                <div class="search-bar">
                    <input type="text" placeholder="Buscar ${this.type.toLowerCase()}" id="searchInput" value="${this.query}" autocomplete="off">
                    <sl-icon id="clearBtn" class="search-icon" name="x-lg" title="Borrar búsqueda"></sl-icon>
                </div>
                <sl-icon id="searchBtn" class="search-icon" name="search" title="Buscar"></sl-icon>
            </div>
            ${(this.path.includes('/explore/')) ? `
                <div class="tabs-container container">
                    <div class="swiper-button-prev"></div>
                    <div class="swiper">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide selected" data-path="/explore/movie">
                                <a href="/explore/movie" ><sl-icon library="boxicons" name="bx-movie"></sl-icon> Películas</a>
                            </div>
                            <div class="swiper-slide" data-path="/explore/tv">
                                <a href="/explore/tv" ><sl-icon library="boxicons" name="bx-tv"></sl-icon> Series</a>
                            </div>
                            <div class="swiper-slide" data-path="/explore/book">
                                <a href="/explore/book"><sl-icon library="boxicons" name="bx-book"></sl-icon> Libros</a>
                            </div>
                            <!--<div class="swiper-slide" data-hash="#mangas">
                                <a href="#mangas"><sl-icon name="book-half"></sl-icon> Mangas</a>
                            </div>
                            <div class="swiper-slide" data-hash="#anime">
                                <a href="#anime"><sl-icon name="tv"></sl-icon> Anime</a>
                            </div>
                            <div class="swiper-slide" data-hash="#canciones">
                                <a href="#canciones"><sl-icon library="boxicons" name="bx-music"></sl-icon> Canciones</a>
                            </div>
                            <div class="swiper-slide" data-hash="#podcasts">
                                <a href="#podcasts"><sl-icon name="broadcast-pin"></sl-icon> Podcasts</a>
                            </div>
                            <div class="swiper-slide" data-hash="#albumes">
                                <a href="#albumes"><sl-icon name="disc"></sl-icon> Álbumes</a>
                            </div>
                            <div class="swiper-slide" data-hash="#artistas">
                                <a href="#artistas"><sl-icon library="boxicons" name="bx-microphone"></sl-icon> Artistas</a>
                            </div>
                            <div class="swiper-slide" data-hash="#videojuegos">
                                <a href="#videojuegos"><sl-icon name="controller"></sl-icon> Videojuegos</a>
                            </div>-->
                        </div>
                    </div>
                    <div class="swiper-button-next"></div>
                </div>
                ` : ``
            }
        `;
    }

    initEvents() {// Inicializar Swiper
        const swiper = new Swiper('.swiper', {
            slidesPerView: "auto",
            spaceBetween: 15,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            freeMode: true,
        });

        const backBtn = document.querySelector("#backBtn");
        const searchInput = document.getElementById("searchInput");
        const searchBtn = document.getElementById("searchBtn");
        const clearBtn = document.getElementById("clearBtn");
        clearBtn.style.display = searchInput.value ? "block" : "none";

        backBtn.addEventListener("click", () => {
            const path = window.location.pathname;
            if (path.includes('/explore/')) {
                window.history.pushState({}, '', '/dashboard');
                router(routes);
            } else {
                window.history.pushState({}, '', `/list/${this.page.list.id}`);
                router(routes);
            }
        });

        // Eventos para iniciar búsqueda con botón o Enter
        searchBtn.addEventListener("click", async () => await this.handleSearch());
        searchInput.addEventListener("keypress", async (e) => {
            if (e.key === "Enter") await this.handleSearch();
        });

        searchInput.addEventListener("input", () => {
            clearBtn.style.display = searchInput.value ? "block" : "none";
        });

        clearBtn.addEventListener("click", () => {
            searchInput.value = "";
            clearBtn.style.display = "none";
            searchInput.focus();
        });

        try {
            const allTabs = document.querySelectorAll("[data-path]");
            allTabs.forEach(t => {
                t.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    let tab = e.target.closest("[data-path]");
                    let path = tab.dataset.path;
                    window.history.pushState({}, '', path);
                    updateActiveTab();
                    this.type = this.getType();
                    this.page.type = this.getType();
                    document.getElementById("searchInput").setAttribute("placeholder", `Buscar ${this.type.toLowerCase()}`)
                })
            })

            // Resaltar tab según el hash en la URL
            const updateActiveTab = () => {
                const currentPath = window.location.pathname;
                const tabs = document.querySelectorAll('.swiper-slide');
                tabs.forEach(tab => tab.classList.remove('selected'));
                const activeTab = document.querySelector(`.swiper-slide[data-path="${currentPath}"]`);
                if (activeTab) {
                    activeTab.classList.add('selected');
                    const index = Array.from(tabs).indexOf(activeTab);
                    swiper.slideTo(index, 1000, true);
                }
            };

            // Inicializar la selección del tab
            updateActiveTab();
        } catch (e) {

        }
    }

    async handleSearch() {
        const searchInput = document.getElementById("searchInput");
        const query = searchInput.value.trim();

        if (query) {
            window.history.pushState({}, '', this.getURL(this.type, query));
            this.page.query = query;
            const app = document.querySelector("#app");
            app.innerHTML = `
            <div id="loader">
                <sl-spinner style="font-size: var(--font-size-xl); --indicator-color: var(--primary-color); --track-color: transparent;"></sl-spinner>
            </div>
            `;
            app.innerHTML = await this.page.render();
            this.page.initEvents();
        }
    }

    getURL(type, query) {
        const path = window.location.pathname;
        if (path.includes('/search/')) {
            switch (type) {
                case 'Película':
                    return `/list/${this.page.list.id}/search/movie?q=${query}`;
                case 'Serie':
                    return `/list/${this.page.list.id}/search/tv?q=${query}`;
                case 'Libro':
                    return `/list/${this.page.list.id}/search/book?q=${query}`;
                default:
                    console.error("URL no válida.");
                    return ``;
            }
        } else if (path.includes('/explore/')) {
            switch (type) {
                case 'Película':
                    return `/explore/movie?q=${query}`;
                case 'Serie':
                    return `/explore/tv?q=${query}`;
                case 'Libro':
                    return `/explore/book?q=${query}`;
                default:
                    console.error("URL no válida.");
                    return ``;
            }
        }
    }

    getType() {
        const path = window.location.pathname;
        if (path.includes('/explore/movie') || path.includes('/search/movie'))
            return 'Película';
        else if (path.includes('/explore/tv') || path.includes('/search/tv'))
            return 'Serie';
        else if (path.includes('/explore/book') || path.includes('/search/book'))
            return 'Libro';
        else return 'Elemento';
    }
}
