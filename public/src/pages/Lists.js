import EmptyScreen from '../components/EmptyScreen.js';
import dashboardHeader from '../components/dashboardHeader.js';
import List from '../components/List.js';
import Lista from '../models/Lista.js';
import store from '../state/index.js';

export default class Lists {
    constructor() {
        this.docTitle = "Mis listas";
        this.user = store.state.user;
        this.header = new dashboardHeader();
        this.listComponent = new List();
        this.emptyscreen = new EmptyScreen();
    }

    async initialize() {
        let unorderedLists = await Lista.getAllLists(this.user.uid);
        this.lists = unorderedLists.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
        const d = document;

        const header = this.header.render();
        d.querySelector('header').innerHTML = header;
        this.header.initEvents();

        const page = this.render();
        d.querySelector("title").innerText = this.docTitle;
        d.querySelector("#app").innerHTML = page;
        this.initEvents();
    }

    render() {
        return `
            <sl-drawer placement="bottom" class="filters-container">
                <div class="container">
                    <div class="radio-header">
                        <span>Filtrar por</span>
                    </div>
                    <div class="radio-group .radio-filter-by radio-pill">
                        <label>
                            <input type="radio" name="status-option" value="todo" checked>
                            <div class="radio-button">
                                Todo
                            </div>
                        </label>
                        <label>
                            <input type="radio" name="status-option" value="destacadas">
                            <div class="radio-button">
                                Destacadas
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
                            <input type="radio" name="sort-option" value="fecha-creacion" checked>
                            <div class="radio-button">Fecha de creación</div>
                        </label>
                        <label>
                            <input type="radio" name="sort-option" value="contenido">
                            <div class="radio-button">Contenido</div>
                        </label>
                        <label>
                            <input type="radio" name="sort-option" value="orden-alfabetico">
                            <div class="radio-button">Orden alfabético</div>
                        </label>
                    </div>
                </div>
            </sl-drawer>

           <div class="lists-container">
            ${(this.lists.length > 0) ?
                this.lists.map(lista => `${this.listComponent.render(lista)}`).join('')
                : this.emptyscreen.render("inbox", "Aún no has creado tu primera lista.")}
            </div>        
        `;

    }

    initEvents() {
        const filterListsBtn = document.querySelector("#filterListsBtn");
        const filtersContainer = document.querySelector(".filters-container");

        filterListsBtn.addEventListener('click', () => {
            filtersContainer.style.display = "block";
            filtersContainer.show();
        })

        filtersContainer.addEventListener("sl-after-hide", () => {
            const allFilterBy = document.querySelectorAll("[name='status-option']");
            const allOrderBy = document.querySelectorAll("[name='sort-option']");
            const allDirections = document.querySelectorAll("[name='sort-direction']");
            const filter = Array.from(allFilterBy).find(c => c.checked)?.value || "todo";
            const order = Array.from(allOrderBy).find(c => c.checked)?.value || "fecha-creacion";
            const direction = Array.from(allDirections).find(c => c.checked)?.value || "desc";

            const filterParams = [
                { key: "filter", value: filter },
                { key: "order", value: order },
                { key: "direction", value: direction }
            ]

            const filteredLists = this.filterLists(filterParams);
            this.showLists(filteredLists);

        });
    }

    filterLists(filterParams) {
        let filteredLists = Array.from(this.lists).slice();

        // Aplicar filtros
        filterParams.forEach(f => {
            if (f.key === "filter") {
                switch (f.value) {
                    case "destacadas":
                        filteredLists = filteredLists.filter(l => l.destacada === true);
                        break;
                    default:
                        filteredLists = filteredLists;
                        break;
                }
            } else if (f.key === "order") {
                switch (f.value) {
                    case "fecha-creacion":
                        filteredLists.sort((a, b) => new Date(b.fechaAgregado) - new Date(a.fechaAgregado));
                        break;
                    case "contenido":
                        filteredLists.sort((a, b) => b.elementos.length - a.elementos.length);
                        break;
                    case "orden-alfabetico":
                        filteredLists.sort((a, b) => a.nombre.localeCompare(b.nombre));
                        break;
                    default:
                        filteredLists = filteredLists
                        break;
                }
            } else if (f.key === "direction") {
                if (f.value === "asc") {
                    filteredLists.reverse();
                }
            }
        });

        return filteredLists || [];
    }

    showLists(filteredLists) {
        const listsContainer = document.querySelector(`.lists-container`);
        const html = filteredLists.map(list => this.listComponent.render(list)).join('');

        // Actualizar el contenedor con los nuevos elementos
        listsContainer.innerHTML = html;

        // Si no hay elementos, mostrar pantalla vacía
        if (filteredLists.length === 0) {
            listsContainer.innerHTML = this.emptyscreen.render(
                "emoji-frown",
                `No se encontraron listas que coincidan con los filtros seleccionados.`
            );
        }
    }
}
