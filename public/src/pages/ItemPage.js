// pages/Explore.js
import EmptyScreen from '../components/EmptyScreen.js';
import itemPageHeader from '../components/itemPageHeader.js';
import Toast from '../components/Toast.js';
import Lista from '../models/Lista.js';
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getDetailsTMDB } from '../services/tmdbService.js';
import { fetchBookDetails } from '../services/googleBooksService.js';
import { translateMovieStatus, translateTvStatus } from '../utilities/translateStatusTMDB.js';
import { routes } from '../router/routes.js';
import { router } from '../router/router.js';
import store from '../state/index.js';

export default class ItemPage {
    constructor(params) {
        this.listId = params.listId;
        this.itemId = params.itemId;
        this.user = store.state.user;
        this.emptyscreen = new EmptyScreen();
    }

    async initialize() {
        this.list = await Lista.getById(this.user.uid, this.listId);
        this.item = await this.list.getElemento(this.itemId);
        this.header = new itemPageHeader(this.user, this.item);
        // console.log(this.item);
        const header = this.header.render();
        document.querySelector('header').innerHTML = header;
        this.header.initEvents();

        document.querySelector("title").innerText = this.item.titulo;
        const page = this.render();
        document.querySelector("#app").innerHTML = page;
        this.initEvents();
    }

    render() {
        const item = this.item;
        const list = this.list;
        const allStatus = this.getAllStatus(list.tipo);
        const inactiveStatus = allStatus.filter(s => s !== item.estado);
        if (item) {
            return `
                <div class="dropdown-wrapper">
                    <sl-dropdown placement="top-end" distance="20" id="statusOptions">
                        <div slot="trigger" class="floating-btn">
                            <sl-icon name="${this.getIconName(item.estado)}"></sl-icon>
                        </div>
                        <sl-menu>
                            ${inactiveStatus.map(status => `
                            <sl-menu-item class="status" id="${status}">
                                ${status}
                                <sl-icon slot="prefix" name="${this.getIconName(status)}"></sl-icon>
                            </sl-menu-item>`).join('')}
                        </sl-menu>
                    </sl-dropdown>
                </div>
                <sl-dialog label="Calificar ${list.tipo.toLowerCase()}" id="starsDialog" class="dialog-overview">
                    <div class="stars-container">
                        <sl-rating label="Rating" max="10" precision="0.25" value="${item.calificacion}"></sl-rating>
                    <sl-input class="form-input" type="number" min="0" max="10" step="0.25" value="${item.calificacion}"></sl-input>
                    </div>
                    <sl-button id="saveCalificationBtn" slot="footer" variant="primary">Guardar calificación</sl-button>
                </sl-dialog>
                <sl-dialog label="Escribir nota" id="noteDialog" class="dialog-overview">
                    <div class="note-container">
                        <sl-textarea 
                            label="${item.nota.length}/500" 
                            class="form-input" 
                            autocomplete="off" 
                            name="nota" 
                            placeholder="Escribe lo que piensas..." 
                            maxlength="500"
                            value="${(item.nota !== "") ? item.nota : ''}">
                        </sl-textarea>
                    </div>
                    <sl-button id="saveNoteBtn" slot="footer" variant="primary">Guardar nota</sl-button>
                </sl-dialog>
                <div class="item-container">
                    <div class="image-container">
                        <div class="image-box image-box-2-3">
                            ${this.renderCalification(item.calificacion)}
                            <img src="${item.urlImagen ? item.urlImagen : "../assets/img/no-image-found.jpg"}" alt="${item.nombre}" loading="lazy">
                        </div>
                    </div>
                    <div class="details-container">
                        <h1>${item.titulo}</h1>
                        <div class="meta-data-container">
                        ${item.getMetaData().map(meta => `
                            ${(meta.key === "Año") ? `
                            <div class="meta-data main">
                                ${meta.value}
                            </div>` : `
                            <div class="meta-data">
                                ${meta.value}
                            </div>
                            `}`).join('')}
                        </div>
                        <hr>
                        <div class="info-container">
                            ${(item.nota !== "") ? `
                            <div class="note-box info-box">
                                <h3>Nota <sl-icon id="editarNota2" name="pen-fill"></sl-icon></h3>
                                <p>${item.nota}</p>
                                <hr>
                            </div>
                            ` : ``}
                            ${item.getInfo().map(meta => `
                                <div class="info-box">
                                    <h3>${meta.key}</h3>
                                    <p>${meta.value}</p>
                                </div>
                                `).join('')}
                        </div>
                        <sl-button id="redirectToBtn" class="btn" data-href="${item.url}">
                            <sl-icon slot="suffix" name="link-45deg"></sl-icon>
                            Saber más
                        </sl-button>
                    </div>
                </div>`;
        } else {
            return this.emptyscreen.render("emoji-frown", `El elemento que estás buscando no existe.`)
        }
    }

    initEvents() {
        const calificarBtn = document.querySelector("#calificarBtn");
        const editarNotaBtn = document.querySelector("#editarNota");
        const actualizarElementoBtn = document.querySelector("#actualizarElemento");
        const starsDialog = document.querySelector("#starsDialog");
        const noteDialog = document.querySelector("#noteDialog");
        const numberInput = document.querySelector(".form-input[type='number']");
        const rating = document.querySelector("sl-rating");
        const note = document.querySelector(".form-input[name='nota']");
        const saveCalificationBtn = document.querySelector("#saveCalificationBtn");
        const saveNoteBtn = document.querySelector("#saveNoteBtn");
        const redirectToBtn = document.querySelector("#redirectToBtn");

        document.querySelector("#editarNota2")?.addEventListener("click", () => {
            noteDialog.show();
        })

        redirectToBtn.addEventListener("click", () => {
            window.open(redirectToBtn.dataset.href, "_blank")
        })

        calificarBtn.addEventListener("click", () => {
            calificarBtn.blur();
            starsDialog.show();
        })

        editarNotaBtn.addEventListener("click", () => {
            editarNotaBtn.blur();
            noteDialog.show();
        })

        actualizarElementoBtn?.addEventListener("click", async () => {
            await this.updateElemento();
        })

        numberInput.addEventListener("input", () => {
            rating.setAttribute("value", numberInput.value);
        })

        rating.addEventListener("sl-change", () => {
            numberInput.setAttribute("value", rating.value);
        })

        note.addEventListener("input", () => {
            note.setAttribute("label", `${note.value.length}/500`);

            if (note.value.length === 500) {
                Toast({
                    text: "Haz alcanzado el límite de caracteres.",
                    duration: 3000,
                    close: true,
                    gravity: "bottom", // `top` or `bottom`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    className: "danger",
                });
            }
        })

        saveCalificationBtn.addEventListener("click", async () => {
            const calificacion = numberInput.value;

            if (calificacion >= 0 && calificacion <= 10) {
                this.item.calificacion = Number(numberInput.value);
                saveCalificationBtn.blur();
                starsDialog.hide();

                // Actualizar calificación
                await this.list.updateElemento(this.item.id, {
                    calificacion: Number(numberInput.value),
                });
            } else {
                Toast({
                    text: "Ingresa una calificación valida.",
                    duration: 3000,
                    close: true,
                    gravity: "bottom", // `top` or `bottom`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    className: "danger",
                });
            }
        })

        starsDialog.addEventListener("sl-hide", () => {
            const scoreLabel = document.querySelector(".score-label");
            const imageBox = document.querySelector(".image-box");

            if (scoreLabel) {
                scoreLabel.remove();
            }

            imageBox.innerHTML += this.renderCalification(this.item.calificacion);

        })

        saveNoteBtn.addEventListener("click", async () => {
            this.item.nota = note.value.trim();
            saveNoteBtn.blur();
            noteDialog.hide();

            // Actualizar nota
            await this.list.updateElemento(this.item.id, {
                nota: note.value.trim(),
            });
        })

        noteDialog.addEventListener("sl-hide", () => {
            const infoContainer = document.querySelector(".info-container");
            let noteBox = document.querySelector(".note-box") || null;

            if (noteBox) {
                noteBox.remove();
            }
            if (this.item.nota !== "") {

                noteBox = `
                    <div class="note-box info-box">
                        <h3>Nota<sl-icon id="editarNota2" name="pen-fill"></sl-icon></h3>
                        <p>${this.item.nota}</p>
                        <hr>
                    </div>`;

                infoContainer.innerHTML = noteBox + infoContainer.innerHTML;
                document.querySelector("#editarNota2").addEventListener("click", () => {
                    noteDialog.show();
                })
            }
        })

        document.querySelector("#statusOptions sl-menu").addEventListener("click", async (e) => {
            let status = e.target.closest('sl-menu-item.status');

            if (status) {
                e.preventDefault();

                const floatingBtnIcon = document.querySelector(".floating-btn sl-icon");
                floatingBtnIcon.name = this.getIconName(status.id);
                this.item.estado = status.id;

                let statusMenu = document.querySelector("#statusOptions sl-menu");
                const allStatus = this.getAllStatus(this.list.tipo);
                const inactiveStatus = allStatus.filter(s => s !== this.item.estado);

                statusMenu.innerHTML = `
                    ${inactiveStatus.map(status => `
                    <sl-menu-item class="status" id="${status}">
                        ${status}
                        <sl-icon slot="prefix" name="${this.getIconName(status)}"></sl-icon>
                    </sl-menu-item>`).join('')}
                `;

                Toast({
                    text: `Estado actualizado a "${status.id}".`,
                    duration: 5000,
                    close: true,
                    gravity: "bottom",
                    stopOnFocus: false,
                    className: "success",
                });

                let realStatus = this.getRealStatus(status.id);
                // Actualizar estado
                if (realStatus === "en progreso") {
                    await this.list.updateElemento(this.item.id, {
                        estado: status.id,
                        fechaInicio: serverTimestamp(),
                        fechaFin: null
                    });
                } else if (realStatus === "completado") {
                    await this.list.updateElemento(this.item.id, {
                        estado: status.id,
                        fechaFin: serverTimestamp()
                    });
                } else {
                    await this.list.updateElemento(this.item.id, {
                        estado: status.id,
                        fechaInicio: null,
                        fechaFin: null
                    });
                }
            }
        });
    }

    renderCalification(calification) {
        return (calification > 0) ? `<span class="score-label">${calification}★</span>` : "";
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

    getIconName(status) {
        const realStatus = this.getRealStatus(status);

        if (realStatus === "pendiente") {
            return 'clock';
        } else if (realStatus === "en progreso") {
            return 'clock-history';
        } else {
            return 'check-lg';
        }
    }

    getRealStatus(status) {
        if (status === "Pendiente") {
            return "pendiente";
        } else if (status === "Viendo" || status === "Leyendo" || status === "Escuchando" || status === "Jugando") {
            return "en progreso";
        } else {
            return "completado";
        }
    }

    async updateElemento() {
        const list = this.list;
        const itemId = this.item.id;
        const originaItemId = this.item.originalId;
        const t = list.tipo;
        let fullItemData = null;

        const localData = localStorage.getItem(`${itemId}-nextupdate`);
        const nextUpdate = (localData) ? new Date(localData) : null;
        const now = new Date();

        if (!nextUpdate || (nextUpdate < now)) {
            await update();
        }
        else {
            Toast({
                text: `Aún no puedes volver a actualizar el elemento.`,
                duration: 3000,
                close: true,
                gravity: "bottom",
                stopOnFocus: true,
                className: "danger",
            })
        }

        async function update() {
            if (t === "Película") {
                fullItemData = await getDetailsTMDB(originaItemId, t);
                await list.updateElemento(itemId, {
                    originalId: fullItemData.id.toString(),
                    estadoTMDB: translateMovieStatus(fullItemData.status),
                    titulo: fullItemData.title,
                    listaId: list.id,
                    descripcion: fullItemData.overview,
                    urlImagen: `https://image.tmdb.org/t/p/w300${fullItemData.poster_path}`,
                    url: `https://www.themoviedb.org/movie/${fullItemData.id.toString()}`,
                    genero: fullItemData.genres.map(g => g.name),
                    duracion: Number(fullItemData.runtime),
                    ultimaFechaActualizacion: serverTimestamp(),
                    fechaSalida: (new Date(fullItemData.release_date)).toISOString(),
                })
            }
            else if (t === "Serie") {
                fullItemData = await getDetailsTMDB(originaItemId, t);
                await list.updateElemento(itemId, {
                    originalId: fullItemData.id.toString(),
                    estadoTMDB: translateTvStatus(fullItemData.status),
                    titulo: fullItemData.name,
                    listaId: list.id,
                    descripcion: fullItemData.overview,
                    urlImagen: `https://image.tmdb.org/t/p/w300${fullItemData.poster_path}`,
                    url: `https://www.themoviedb.org/tv/${fullItemData.id.toString()}`,
                    genero: fullItemData.genres.map(g => g.name),
                    temporadas: Number(fullItemData.number_of_seasons),
                    episodios: Number(fullItemData.number_of_episodes),
                    fechaSalida: (new Date(fullItemData.first_air_date)).toISOString(),
                    ultimaFechaActualizacion: serverTimestamp(),
                })
            }
            else if (t === "Canción" || t === "Artista" || t === "Podcast" || t === "Álbum")
                return [];
            else if (t === "Libro") {
                fullItemData = await fetchBookDetails(originaItemId);
                await list.updateElemento(itemId, {
                    originalId: fullItemData.id.toString(),
                    editorial: fullItemData.volumeInfo.publisher,
                    titulo: fullItemData.volumeInfo.title,
                    listaId: list.id,
                    paginas: fullItemData.volumeInfo.pageCount,
                    descripcion: ItemPage.stripHTML(fullItemData.volumeInfo.description),
                    urlImagen: fullItemData.volumeInfo.imageLinks.thumbnail || fullItemData.volumeInfo.imageLinks.smallThumbnail,
                    categoria: fullItemData.volumeInfo.categories,
                    url: fullItemData.volumeInfo.infoLink,
                    autor: fullItemData.volumeInfo.authors,
                    fechaSalida: (new Date(fullItemData.volumeInfo.publishedDate)).toISOString(),
                })
            }
            else if (t === "Videojuego")
                return [];
            else if (t === "Anime" || t === "Manga")
                return [];
            else return [];

            Toast({
                text: `Se ha actualizado la información del elemento.`,
                duration: 3000,
                close: true,
                gravity: "bottom",
                stopOnFocus: true,
                className: "success",
            })

            now.setMonth(now.getMonth() + 6);
            localStorage.setItem(`${itemId}-nextupdate`, now);
            router(routes);
        }
    }

    static stripHTML(htmlString) {
        return htmlString.replace(/<[^>]*>/g, '').trim();
    }
}
