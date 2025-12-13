import { router } from '../router/router.js';
import { routes } from '../router/routes.js';
import Lista from '../models/Lista.js';

export default class ListForm {

    constructor(user, page = null) {
        this.user = user;
        this.page = page;
    }

    render() {
        return `
            <sl-drawer class="list-form hidden" label="Agregar Lista" placement="bottom" style="--size: 100vh;">
                <div slot="header-actions" class="nav container">
                    <sl-icon id="quitFormBtn" class="nav-icon" name="arrow-left"></sl-icon>
                </div>
                <form id="listForm" class="container">

                    <div class="input-header">
                        <span>Nombre de la Lista</span>
                    </div>
                    <sl-input class="form-input" autocomplete="off" name="name" placeholder="Ingresa el nombre de la lista" size="large" required></sl-input>
                    
                    ${(!this.page) ? `
                        <div class="input-header">
                            <span>Tipo de Lista</span>
                        </div>
                        <div class="radio-group radio-pill">
                        <label>
                            <input type="radio" name="list-type" value="Película" required checked>
                            <div class="radio-button">
                            <sl-icon library="boxicons" name="bx-movie"></sl-icon> Películas
                            </div>
                        </label>
                        <label>
                            <input type="radio" name="list-type" value="Serie">
                            <div class="radio-button">
                            <sl-icon library="boxicons" name="bx-tv"></sl-icon> Series
                            </div>
                        </label>
                        <label>
                            <input type="radio" name="list-type" value="Libro">
                            <div class="radio-button">
                            <sl-icon library="boxicons" name="bx-book"></sl-icon> Libros
                            </div>
                        </label>
                        <!-- <label>
                            <input type="radio" name="list-type" value="Anime">
                            <div class="radio-button">
                            <sl-icon name="tv"></sl-icon> Animes
                            </div>
                        </label>
                        <label>
                            <input type="radio" name="list-type" value="Manga">
                            <div class="radio-button">
                            <sl-icon name="book-half"></sl-icon> Mangas
                            </div>
                        </label>
                        <label>
                            <input type="radio" name="list-type" value="Videojuego">
                            <div class="radio-button">
                            <sl-icon name="controller"></sl-icon> Videojuegos
                            </div>
                        </label>
                        <label>
                            <input type="radio" name="list-type" value="Canción">
                            <div class="radio-button">
                            <sl-icon library="boxicons" name="bx-music"></sl-icon> Canciones
                            </div>
                        </label>
                        <label>
                            <input type="radio" name="list-type" value="Álbum">
                            <div class="radio-button">
                            <sl-icon name="disc"></sl-icon> Álbumes
                            </div>
                        </label>
                        <label>
                            <input type="radio" name="list-type" value="Artista">
                            <div class="radio-button">
                            <sl-icon library="boxicons" name="bx-microphone"></sl-icon> Artistas
                            </div>
                        </label>
                        <label>
                            <input type="radio" name="list-type" value="Podcast">
                            <div class="radio-button">
                            <sl-icon name="broadcast-pin"></sl-icon> Podcasts
                            </div>
                        </label>
                        <label>
                            <input type="radio" name="list-type" value="Enlace">
                            <div class="radio-button">
                            <sl-icon library="boxicons" name="bx-link"></sl-icon> Enlaces
                            </div>
                        </label>
                        <label>
                            <input type="radio" name="list-type" value="Personalizado">
                            <div class="radio-button">
                            <sl-icon library="boxicons" name="bx-list-ul"></sl-icon> Personalizada
                            </div>
                        </label> -->
                    </div>` : ``}
                </form>
                <sl-button class="btn" slot="footer" form="listForm" variant="primary" type="submit">Guardar</sl-button>
            </sl-drawer>
        `;
    }

    initEvents() {
        const drawer = document.querySelector('.list-form');
        const form = document.querySelector('#listForm');
        const quitFormBtn = document.querySelector("#quitFormBtn");

        drawer.addEventListener('sl-show', () => {
            document.body.style.overflow = "hidden";
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!form.reportValidity()) {
                console.log("Formulario no válido.");
                return;
            }

            const formData = new FormData(form);

            if (this.page && this.page.itemId) {
                const newLista = new Lista({
                    nombre: formData.get('name').toString(),
                    destacada: false,
                    tipo: this.page.type,
                    idUsuario: this.user.uid,
                    elementos: []
                })

                await newLista.save();
                document.body.style.overflow = 'auto';
                drawer.hide();
                form.reset();

                await this.page.handleAddToList(this.page.itemId, newLista.id);
            } else {
                const newLista = new Lista({
                    nombre: formData.get('name').toString(),
                    destacada: false,
                    tipo: formData.get('list-type').toString(),
                    idUsuario: this.user.uid,
                    elementos: []
                });
                await newLista.save();

                document.body.style.overflow = 'auto';
                window.history.pushState({}, '', `/list/${newLista.id}`);
                router(routes);
            }

        });


        quitFormBtn.addEventListener("click", () => {
            document.body.style.overflow = 'auto';
            drawer.hide();
            form.reset();
        });
    }
}