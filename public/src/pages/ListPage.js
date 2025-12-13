// pages/Explore.js
import Item from '../components/Item.js';
import EmptyScreen from '../components/EmptyScreen.js';
import listPageHeader from '../components/ListPageHeader.js';
import Lista from '../models/Lista.js';
import { routes } from '../router/routes.js';
import { router } from '../router/router.js';
import { Firestore, FieldValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

export default class ListPage {
    constructor(user, params) {
        this.user = user;
        this.listId = params.listId;
        this.itemComponent = new Item();
        this.emptyscreen = new EmptyScreen();
    }

    async initialize() {
        Promise.all(
            this.lists = await Lista.getAllLists(this.user.uid),
        )
        this.list = this.lists.find(l => l.id === this.listId);
        this.items = this.list.elementos.sort((a, b) => new Date(b.fechaAgregado) - new Date(a.fechaAgregado));
        this.header = new listPageHeader(this.list, this.lists);

        const header = this.header.render();
        document.querySelector('header').innerHTML = header;
        this.header.initEvents();

        document.querySelector("title").innerText = this.list.nombre;
        const page = this.render();
        document.querySelector("#app").innerHTML = page;
        this.initEvents();
    }

    render() {
        if (this.list) {
            const list = this.list;
            const dimensions = this.getDimensions(list.tipo);
            const allStatus = this.getAllStatus(list.tipo);
            const items = this.items;

            return `
                <div id="addElement" class="floating-btn">
                    <sl-icon library="boxicons" name="bx-plus"></sl-icon>
                </div>

                <sl-drawer placement="bottom" class="filters-container">
                    <div class="container">
                        <div class="radio-header">
                            <span>Filtrar por</span>
                        </div>
                        <div class="radio-group radio-filter-by">
                            <label>
                                <input type="radio" name="status-option" value="todo" checked>
                                <div class="radio-button">
                                    Todo
                                </div>
                            </label>
                            ${allStatus.map(status => `
                                <label>
                                    <input type="radio" name="status-option" value="${status}">
                                    <div class="radio-button">
                                        ${status}
                                    </div>
                                </label>`).join('')}
                            <label>
                                <input type="radio" name="status-option" value="favorito">
                                <div class="radio-button">
                                    Favoritos
                                </div>
                            </label>
                        </div>
                        <div class="radio-header">
                            <span>Ordenar por</span>
                            <div class="radio-group radio-pill">
                                <label>
                                    <input type="radio" name="sort-direction" value="desc" checked>
                                    <div class="radio-button">
                                        <sl-icon name="sort-down"></sl-icon>
                                    </div>
                                </label>
                                <label>
                                    <input type="radio" name="sort-direction" value="asc">
                                    <div class="radio-button">
                                        <sl-icon name="sort-up-alt"></sl-icon>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div class="radio-group radio-sort-by">
                            <label>
                                <input type="radio" name="sort-option" value="fecha-adicion" checked>
                                <div class="radio-button">Fecha de adición</div>
                            </label>
                            <label>
                                <input type="radio" name="sort-option" value="calificacion">
                                <div class="radio-button">Calificación</div>
                            </label>
                            <label>
                                <input type="radio" name="sort-option" value="orden-alfabetico">
                                <div class="radio-button">Orden alfabético</div>
                            </label>
                            <label>
                                <input type="radio" name="sort-option" value="fecha-finalizacion">
                                <div class="radio-button">Fecha de finalización</div>
                            </label>
                        </div>
                    </div>
                </sl-drawer>

                ${(items.length > 0) ? `
                    <div class="items-container-${dimensions}">
                    ${items.map(item => this.itemComponent.render(item, list, dimensions)).join('')}
                    </div>
                    `
                    : this.emptyscreen.render("folder2-open", `Aún no has agregado elementos a esta lista.`)}
            `;
        } else {
            return this.emptyscreen.render("emoji-frown", `La lista que estás buscando no existe.`)
        }
    }

    initEvents() {
        const filterItemsBtn = document.querySelector("#filterItemsBtn");
        const filtersContainer = document.querySelector(".filters-container");
        const addElement = document.querySelector("#addElement");

        addElement.addEventListener("click", () => {
            let type = this.list.tipo;
            switch (type) {
                case "Personalizado":
                    break;
                case "Enlace":
                    break;
                default:
                    window.history.pushState({}, '', this.getURL(this.list.tipo));
                    router(routes);
                    break;
            }
        })

        try {
            filterItemsBtn.addEventListener('click', () => {
                filtersContainer.style.display = "block";
                filtersContainer.show();
            })

            if (this.items.length > 0) {
                filtersContainer.addEventListener("sl-after-hide", () => {
                    const allFilterBy = document.querySelectorAll("[name='status-option']");
                    const allOrderBy = document.querySelectorAll("[name='sort-option']");
                    const allDirections = document.querySelectorAll("[name='sort-direction']");
                    const filter = Array.from(allFilterBy).find(c => c.checked)?.value || "todo";
                    const order = Array.from(allOrderBy).find(c => c.checked)?.value || "fecha-salida";
                    const direction = Array.from(allDirections).find(c => c.checked)?.value || "desc";

                    const filterParams = [
                        { key: "filter", value: filter },
                        { key: "order", value: order },
                        { key: "direction", value: direction }
                    ]

                    const filteredItems = this.filterItems(filterParams);
                    this.showElements(filteredItems);

                });
            }
        } catch (e) {
            console.error("La lista que estás buscando no existe.");
        }
    }

    getURL(type) {
        switch (type) {
            case 'Película':
                return `/list/${this.list.id}/search/movie`;
            case 'Serie':
                return `/list/${this.list.id}/search/tv`;
            case 'Libro':
                return `/list/${this.list.id}/search/book`;
            default:
                console.error("URL no válida.");
                return ``;
        }
    }

    getAllStatus(type) {
        const mapping = {
            Película: ["Pendiente", "Vista"],
            Serie: ["Pendiente", "Viendo", "Completada"],
            Libro: ["Pendiente", "Leyendo", "Leído"],
            Manga: ["Pendiente", "Leyendo", "Leído"],
            Anime: ["Pendiente", "Viendo", "Completado"],
            Videojuego: ["Pendiente", "Jugando", "Jugado"],
            Canción: ["Pendiente", "Escuchada"],
            Álbum: ["Pendiente", "Escuchando", "Escuchado"],
            Podcast: ["Pendiente", "Escuchando", "Escuchado"],
            Artista: ["Pendiente", "Escuchado"],
        };
        return mapping[type] || ["Pendiente", "Terminado"];
    }

    getDimensions(type) {
        const mapping = {
            Película: "2-3",
            Serie: "2-3",
            Libro: "2-3",
            Manga: "2-3",
            Anime: "2-3",
            Videojuego: "2-3",
            Canción: "1-1",
            Álbum: "1-1",
            Podcast: "1-1",
            Artista: "1-1",
        };
        return mapping[type] || "16-9";
    }

    filterItems(filterParams) {
        const list = this.list;
        let filteredItems = list.elementos;

        // Aplicar filtros
        filterParams.forEach(f => {
            if (f.key === "filter") {
                switch (f.value) {
                    case "favorito":
                        filteredItems = filteredItems.filter(e => e.favorito === true);
                        break;
                    case "todo":
                        break;
                    default:
                        filteredItems = filteredItems.filter(e => e.estado === f.value);
                        break;
                }
            } else if (f.key === "order") {
                switch (f.value) {
                    case "calificacion":
                        filteredItems.sort((a, b) => b.calificacion - a.calificacion);
                        break;
                    case "fecha-adicion":
                        filteredItems.sort((a, b) => new Date(b.fechaAgregado) - new Date(a.fechaAgregado));
                        break;
                    case "fecha-finalizacion":
                        const conFecha = filteredItems.filter(f => f.fechaFin !== null);
                        const sinFecha = filteredItems.filter(f => f.fechaFin === null);
                        const ordenados = conFecha.sort((a, b) => new Date(b.fechaFin) - new Date(a.fechaFin));
                        filteredItems = [...ordenados, ...sinFecha];
                        break;
                    case "orden-alfabetico":
                        filteredItems.sort((a, b) => a.nombre.localeCompare(b.nombre));
                        break;
                    default:
                        break;
                }
            } else if (f.key === "direction") {
                if (f.value === "asc") {
                    filteredItems.reverse();

                    if (filterParams[1].value === "fecha-finalizacion") {
                        const conFecha = filteredItems.filter(f => f.fechaFin !== null);
                        const sinFecha = filteredItems.filter(f => f.fechaFin === null);
                        filteredItems = [...conFecha, ...sinFecha];
                    }
                }
            }
        });

        return filteredItems || [];
    }

    showElements(filteredElements) {
        const list = this.list;
        const dimensions = this.getDimensions(list.tipo);
        const elementsContainer = document.querySelector(`.items-container-${dimensions}`);
        const html = filteredElements.map(item => this.itemComponent.render(item, list, dimensions)).join('');

        // Actualizar el contenedor con los nuevos elementos
        elementsContainer.innerHTML = html;

        // Si no hay elementos, mostrar pantalla vacía
        if (filteredElements.length === 0) {
            elementsContainer.innerHTML = this.emptyscreen.render(
                "emoji-frown",
                `No se encontraron elementos que coincidan con los filtros seleccionados.`
            );
        }
    }
}