// pages/Explore.js
import searchHeader from '../components/searchHeader.js';
import { searchInTMDB, getDetailsTMDB } from '../services/tmdbService.js';
import EmptyScreen from '../components/EmptyScreen.js';
import Toast from '../components/Toast.js';
import Lista from '../models/Lista.js';
import Pelicula from '../models/Pelicula.js';
import Serie from '../models/Serie.js';
import ListForm from '../components/ListForm.js';
import { fetchBookByName, fetchBookDetails } from '../services/googleBooksService.js';
import Libro from '../models/Libro.js';
import store from '../state/index.js';

export default class Explore {
    constructor(params, queryParams) {
        this.type = this.getType();
        this.docTitle = "Explorar - Enterlist";
        this.query = queryParams ? queryParams.q : '';
        this.header = new searchHeader(this.query, this);
        this.emptyscreen = new EmptyScreen();
        this.user = store.state.user;
        this.listForm = new ListForm(this.user, this);
    }

    async initialize() {
        this.lists = await Lista.getAllLists(this.user.uid);

        document.querySelector('header').innerHTML = this.header.render();
        this.header.initEvents();
        const app = document.querySelector("#app");

        document.querySelector("title").innerText = this.docTitle;
        app.innerHTML = await this.render();
        this.initEvents();
    }

    async render() {
        if (this.query) {
            const results = await this.fetchResults() || [];
            if (results.length > 0) {
                return `
                <div class="search-results">
                    ${results.map((item) => `
                        <div class="result-item">
                            <img src="${item.image}" alt="${item.name}" loading="lazy">
                            <div class="info">
                                <h3>${item.name}</h3>
                                ${item.year ? `<p>Año: ${item.year}</p>` : ''}
                            </div>
                            <button data-id="${item.id}" class="add-to-list-btn">
                                <sl-icon name="plus-circle"></sl-icon>
                            </button>
                        </div>
                    `).join("")}
                </div>

                <sl-dialog label="Guardar ${this.type.toLowerCase()} en..." class="dialog-overview">
                    <sl-icon slot="header-actions" name="plus" class="new-list-btn"></sl-icon>
                    <div class="lists-container"></div>
                    <sl-button id="addBtn" slot="footer" variant="primary">Añadir</sl-button>
                </sl-dialog>
                ${this.listForm.render()}
            `;
            } else {
                return this.emptyscreen.render("emoji-frown", `No se encontraron resultados para "${this.query}."`)
            }
        } else {
            return this.emptyscreen.render("search", `Escribe el nombre de lo que deseas encontrar en la barra de búsqueda.`);
        }
    }

    initEvents() {
        const app = document.querySelector("#app")
        app.style.paddingTop = '12.4rem';

        try {
            const dialogContainer = document.querySelector(".dialog-overview");
            const buttons = document.querySelectorAll(".add-to-list-btn");
            const newFormDrawer = document.querySelector(".list-form");
            const openFormDrawerBtn = document.querySelector(".new-list-btn");
            const quitFormBtn = document.querySelector("#quitFormBtn");

            this.listForm.initEvents();

            openFormDrawerBtn.addEventListener("click", () => {
                dialogContainer.hide();
                openFormDrawerBtn.blur();

                newFormDrawer.classList.remove("hidden");
                newFormDrawer.show();
                document.body.style.overflow = "hidden";
            })

            quitFormBtn.addEventListener("click", () => {
                const form = document.querySelector('#listForm');
                document.body.style.overflow = 'auto';
                newFormDrawer.hide();
                form.reset();
            });

            buttons.forEach(button => {
                button.addEventListener("click", (e) => {
                    const itemId = e.currentTarget.dataset.id;
                    this.itemId = itemId;
                    this.showLists(itemId);
                    dialogContainer.show();

                    // Seleccionar checkboxes y el botón de agregar
                    const checkboxes = document.querySelectorAll('sl-checkbox[name="list"]');
                    const addBtn = dialogContainer.querySelector('#addBtn');

                    // Eliminar cualquier manejador anterior para evitar acumulación
                    addBtn.replaceWith(addBtn.cloneNode(true)); // Reemplaza el botón para limpiar eventos
                    const newAddBtn = dialogContainer.querySelector('#addBtn');

                    // Registrar nuevo manejador de clic
                    newAddBtn.addEventListener("click", () => {
                        const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
                        if (checkedCheckboxes.length > 0) {
                            checkedCheckboxes.forEach((checkbox) => {
                                const listId = checkbox.value.toString();
                                this.handleAddToList(itemId, listId);
                            });
                            this.removeLists();
                            newAddBtn.blur(); // Elimina el focus del botón para evitar error de aria-hidden
                            dialogContainer.hide();
                        } else {
                            Toast({
                                text: "Debes seleccionar una lista.",
                                duration: 3000,
                                close: true,
                                gravity: "bottom", // `top` or `bottom`
                                stopOnFocus: true, // Prevents dismissing of toast on hover
                                className: "alert",
                            });
                        }
                    });
                });
            });

            // Escucha cuando se abre el diálogo
            dialogContainer.addEventListener('sl-after-show', () => {
                document.body.style.overflow = "hidden";
            });

            // Escucha cuando se cierra el diálogo
            dialogContainer.addEventListener('sl-after-hide', () => {
                document.body.style.overflow = "visible";
                this.removeLists();
            });
        } catch (e) { }
    }

    async fetchResults() {
        const t = this.type;

        if (t === "Película" || t === "Serie")
            return await searchInTMDB(this.query, this.type);
        else if (t === "Canción" || t === "Artista" || t === "Podcast" || t === "Álbum")
            return [];
        else if (t === "Libro")
            return await fetchBookByName(this.query);
        else if (t === "Videojuego")
            return [];
        else if (t === "Anime" || t === "Manga")
            return [];
        else return [];
    }

    getType() {
        const path = window.location.pathname;
        if (path.includes('/explore/movie'))
            return 'Película';
        else if (path.includes('/explore/tv'))
            return 'Serie';
        else if (path.includes('/explore/book'))
            return 'Libro';
        else return 'Elemento';
    }

    async showLists(id) {
        const thisTypeLists = this.lists.filter(l => l.tipo === this.type);
        const aveilableLists = thisTypeLists.filter(l => !l.elementos.some(elemento => elemento.originalId == id.toString()));
        const listsContainer = document.querySelector(".dialog-overview .lists-container");
        let html = ``;

        if (aveilableLists.length > 0) {
            html = `
            ${aveilableLists.map((list) =>
                `<sl-checkbox name="list" value="${list.id}">${list.nombre}</sl-checkbox>`
            ).join('')}`;
        } else {
            html = `No hay listas disponibles.`;
        }

        listsContainer.innerHTML = html;
    }

    removeLists() {
        const lists = document.querySelectorAll(".lists-container sl-checkbox");
        lists.forEach(list => list.remove());
    }

    async handleAddToList(itemId, listId) {
        const list = await Lista.getById(this.user.uid, listId);
        const t = this.type;
        let fullItemData = null;

        Toast({
            text: `Se ha agregado el elemento a "${list.nombre}".`,
            duration: 3000,
            close: true,
            gravity: "bottom",
            stopOnFocus: true,
            className: "success",
        })

        if (t === "Película") {
            fullItemData = await getDetailsTMDB(itemId, this.type);
            await list.addElemento(new Pelicula({
                originalId: fullItemData.id.toString(),
                estadoTMDB: fullItemData.status,
                titulo: fullItemData.title,
                listaId: listId,
                descripcion: fullItemData.overview,
                urlImagen: `https://image.tmdb.org/t/p/w300${fullItemData.poster_path}`,
                estado: "Pendiente",
                url: `https://www.themoviedb.org/movie/${fullItemData.id.toString()}`,
                genero: fullItemData.genres.map(g => g.name),
                duracion: Number(fullItemData.runtime),
                ultimaFechaActualizacion: null,
                fechaSalida: (new Date(fullItemData.release_date)).toISOString(),
            }))
        }
        else if (t === "Serie") {
            fullItemData = await getDetailsTMDB(itemId, this.type);
            await list.addElemento(new Serie({
                originalId: fullItemData.id.toString(),
                estadoTMDB: fullItemData.status,
                titulo: fullItemData.name,
                listaId: listId,
                descripcion: fullItemData.overview,
                urlImagen: `https://image.tmdb.org/t/p/w300${fullItemData.poster_path}`,
                estado: "Pendiente",
                url: `https://www.themoviedb.org/tv/${fullItemData.id.toString()}`,
                genero: fullItemData.genres.map(g => g.name),
                temporadas: Number(fullItemData.number_of_seasons),
                episodios: Number(fullItemData.number_of_episodes),
                fechaSalida: (new Date(fullItemData.first_air_date)).toISOString(),
            }))
        }
        else if (t === "Canción" || t === "Artista" || t === "Podcast" || t === "Álbum")
            return [];
        else if (t === "Libro") {
            fullItemData = await fetchBookDetails(itemId);
            await list.addElemento(new Libro({
                originalId: fullItemData.id.toString(),
                editorial: fullItemData.volumeInfo.publisher,
                titulo: fullItemData.volumeInfo.title,
                listaId: listId,
                paginas: fullItemData.volumeInfo.pageCount,
                descripcion: this.stripHTML(fullItemData.volumeInfo.description),
                urlImagen: fullItemData.volumeInfo.imageLinks.thumbnail || fullItemData.volumeInfo.imageLinks.smallThumbnail,
                categoria: fullItemData.volumeInfo.categories,
                url: fullItemData.volumeInfo.infoLink,
                autor: fullItemData.volumeInfo.authors,
                fechaSalida: (new Date(fullItemData.volumeInfo.publishedDate)).toISOString(),
            }))
        }
        else if (t === "Videojuego")
            return [];
        else if (t === "Anime" || t === "Manga")
            return [];
        else return [];

        this.lists = await Lista.getAllLists(this.user.uid);
    }

    stripHTML(htmlString) {
        return htmlString.replace(/<[^>]*>/g, '').trim();
    }
}
