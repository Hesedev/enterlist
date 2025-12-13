import Lista from '../models/Lista.js';
import { router } from '../router/router.js';
import { routes } from '../router/routes.js';
import Toast from './Toast.js';

export default class itemPageHeader {
    constructor(user, item) {
        this.user = user;
        this.item = item || null;
    }

    render() {
        if (this.item) {
            const item = this.item;
            const localData = localStorage.getItem(`${this.item.id}-nextupdate`);
            const nextUpdate = (localData) ? new Date(localData) : null;
            return `
            <!--Nav-->
            <div class="nav container">
                <!--Logo-->
                <sl-icon id="backBtn" class="nav-icon" name="arrow-left"></sl-icon>
                <div class="nav-controls">
                    ${(item.favorito === false) ? `
                        <sl-icon id="favoritoBtn" class="nav-icon" name="heart"></sl-icon>` : `
                        <sl-icon id="favoritoBtn" class="nav-icon" name="heart-fill" style="color: red"></sl-icon>`}
                    <sl-dropdown placement="bottom-end" distance="-24">
                        <sl-icon class="nav-icon" slot="trigger" name="three-dots-vertical"></sl-icon>
                        <sl-menu>
                            <sl-menu-item id="calificarBtn">
                                Calificar
                                <sl-icon slot="prefix" name="star-half"></sl-icon>
                            </sl-menu-item>
                            <sl-menu-item id="editarNota">
                                Escribir nota
                                <sl-icon slot="prefix" name="journal-text"></sl-icon>
                            </sl-menu-item>
                            ${(!nextUpdate || (nextUpdate < new Date())) ? `
                                <sl-menu-item id="actualizarElemento">
                                    Actualizar
                                    <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
                                </sl-menu-item>` : ``}
                            <sl-menu-item id="eliminarElemento">
                                Eliminar
                                <sl-icon slot="prefix" name="trash"></sl-icon>
                            </sl-menu-item>
                        </sl-menu>
                    </sl-dropdown>
                </div>
            </div>
            <sl-dialog label="¿Estás seguro de que deseas eliminar ${this.item.titulo}?" id="deleteConfirmationDialog" class="dialog-overview">
                <sl-button class="btn btn-neutral" id="cancelBtn" slot="footer" variant="primary">Cancelar</sl-button>
                <sl-button class="btn btn-danger" id="deleteBtn" slot="footer" variant="primary">Eliminar</sl-button>
            </sl-dialog>
        `;
        } else {
            return `
            <!--Nav-->
            <div class="nav container">
                <!--Logo-->
                <sl-icon id="backBtn" class="nav-icon" name="arrow-left"></sl-icon>
            </div>
        `;
        }
    }

    async initEvents() {
        const backBtn = document.querySelector("#backBtn");

        backBtn.addEventListener("click", () => {
            window.history.back();
        });

        try {
            const list = await Lista.getById(this.user.uid, this.item.listaId);
            const favoritoBtn = document.querySelector("#favoritoBtn");
            const eliminarBtn = document.querySelector("#eliminarElemento");
            const deleteConfirmationDialog = document.querySelector("#deleteConfirmationDialog");
            const deleteConfirmationBtn = document.querySelector("#deleteBtn");
            const cancelBtn = document.querySelector("#cancelBtn");

            eliminarBtn.addEventListener("click", () => {
                deleteConfirmationDialog.show();
                deleteBtn.blur();
            })

            deleteConfirmationBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                await list.deleteElemento(this.item.id);

                deleteConfirmationDialog.hide();
                deleteConfirmationBtn.blur();

                window.history.pushState({}, '', `/list/${list.id}`);
                router(routes);

                Toast({
                    text: `Se ha eliminado ${this.item.titulo} exitosamente.`,
                    duration: 3000,
                    close: true,
                    gravity: "bottom",
                    stopOnFocus: false,
                    className: "success",
                });
            })

            cancelBtn.addEventListener("click", () => {
                deleteConfirmationDialog.hide();
                cancelBtn.blur();
            })

            favoritoBtn.addEventListener("click", async () => {
                if (favoritoBtn.getAttribute("name") === "heart-fill") {
                    favoritoBtn.setAttribute("name", "heart");
                    favoritoBtn.removeAttribute("style");

                    await list.updateElemento(this.item.id, {
                        favorito: false,
                    });
                } else if (favoritoBtn.getAttribute("name") === "heart") {
                    favoritoBtn.setAttribute("name", "heart-fill");
                    favoritoBtn.setAttribute("style", "color: red");

                    await list.updateElemento(this.item.id, {
                        favorito: true,
                    });
                }
                /* favoritoBtn.blur(); */
            })
        } catch (e) {
            console.log(e);
        }
    }
}
