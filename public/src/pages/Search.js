// pages/Explore.js
import searchHeader from '../components/searchHeader.js';
import { searchInTMDB, getDetailsTMDB } from '../services/tmdbService.js';
import { fetchBookByName, fetchBookDetails } from '../services/googleBooksService.js';
import EmptyScreen from '../components/EmptyScreen.js';
import Toast from '../components/Toast.js';
import Lista from '../models/Lista.js';
import Pelicula from '../models/Pelicula.js';
import Serie from '../models/Serie.js';
import Libro from '../models/Libro.js';

export default class Search {
    constructor(user, params, queryParams) {
        this.docTitle = "Agregar elemento";
        this.listId = params.listId;
        this.type = this.getType();
        this.query = queryParams.q;
        this.emptyscreen = new EmptyScreen();
        this.user = user;
    }

    async initialize() {
        this.list = await Lista.getById(this.user.uid, this.listId);
        this.header = new searchHeader(this.query, this);

        document.querySelector('header').innerHTML = this.header.render();
        this.header.initEvents();
        document.querySelector("#app").innerHTML = `
            <div id="loader">
                <sl-spinner style="font-size: var(--font-size-xl); --indicator-color: var(--primary-color); --track-color: transparent;"></sl-spinner>
            </div>
            `;
        document.querySelector("title").innerText = this.docTitle;
        document.querySelector("#app").innerHTML = await this.render();
        this.initEvents();
    }

    async render() {
        console.log("Renderizando")
        if (this.query) {
            const results = await this.fetchResults() || [];
            if (results.length > 0) {
                return `
                <sl-dialog label="Guardar ${this.type.toLowerCase()} en..." class="dialog-overview">
                    <div class="lists-container"></div>
                    <sl-button id="addBtn" slot="footer" variant="primary">Añadir</sl-button>
                </sl-dialog>

                <div class="search-results">
                    ${results.map((item) => `
                        <div class="result-item">
                            <img src="${item.image}" alt="${item.name}" loading="lazy">
                            <div class="info">
                                <h3>${item.name}</h3>
                                ${item.year ? `<p>Año: ${item.year}</p>` : ''}
                            </div>
                            <button data-id="${item.id}" class="add-to-list-btn">
                                ${(this.list.elementos.some(el => el.originalId === item.id.toString())) ? `
                                <sl-icon name="check-circle"></sl-icon>` : `
                                <sl-icon name="plus-circle"></sl-icon>`}
                            </button>
                        </div>
                    `).join("")}
                </div>
            `;
            } else {
                return this.emptyscreen.render("emoji-frown", `No se encontraron resultados para "${this.query}."`)
            }
        } else {
            return this.emptyscreen.render("search", `Escribe el nombre de lo que deseas encontrar en la barra de búsqueda.`);
        }
    }

    initEvents() {
        try {
            const buttons = document.querySelectorAll(".add-to-list-btn");

            buttons.forEach(button => {
                button.addEventListener("click", async (e) => {
                    e.preventDefault();
                    const itemId = e.currentTarget.dataset.id;
                    this.list = await Lista.getById(this.user.uid, this.listId);

                    if (this.list.elementos.some(el => el.originalId === itemId)) {
                        Toast({
                            text: `No puedes agregar este elemento porque ya se encuentra en la lista.`,
                            duration: 5000,
                            close: true,
                            gravity: "bottom",
                            stopOnFocus: true,
                            className: "danger",
                        })
                    } else {
                        this.handleAddToList(itemId, this.list);
                        button.innerHTML = `<sl-icon name="check-circle"></sl-icon>`;
                    }
                });
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
        if (path.includes('/search/movie'))
            return 'Película';
        else if (path.includes('/search/tv'))
            return 'Serie';
        else if (path.includes('/search/book'))
            return 'Libro';
        else return 'Elemento';
    }

    async handleAddToList(itemId, list) {
        const t = list.tipo;
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
                listaId: list.id,
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
                listaId: list.id,
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
                listaId: list.id,
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