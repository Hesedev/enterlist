import Lista from '../models/Lista.js';
import { router } from '../router/router.js';
import { routes } from '../router/routes.js';
import Toast from './Toast.js';

export default class listPageHeader {
    constructor(list, lists) {
        this.list = list || null;
        this.lists = lists;
    }

    render() {
        if (this.list) {
            const list = this.list;
            return `
            <!--Nav-->
            <div class="nav container">
                <!--Logo-->
                <sl-icon id="backBtn" class="nav-icon" name="arrow-left"></sl-icon>
                <div class="list-name">
                    ${list.nombre}
                </div>
                <div class="nav-controls">
                    <sl-dropdown placement="bottom-end" distance="-24">
                        <sl-icon class="nav-icon" slot="trigger" name="three-dots-vertical"></sl-icon>
                        <sl-menu>
                            <sl-menu-item id="filterItemsBtn">
                                Filtrar
                                <sl-icon slot="prefix" name="sliders"></sl-icon>
                            </sl-menu-item>
                            <sl-menu-item id="cambiarNombre">
                                Cambiar nombre
                                <sl-icon slot="prefix" name="pen"></sl-icon>
                            </sl-menu-item>
                            <sl-menu-item id="destacarLista">
                                ${(list.destacada === true) ? `
                                    Eliminar de destacados<sl-icon slot="prefix" name="bookmark-dash"></sl-icon>` : `
                                    Destacar<sl-icon slot="prefix" name="bookmark"></sl-icon>`}
                            </sl-menu-item>
                            <sl-menu-item id="eliminarLista">
                                Eliminar lista
                                <sl-icon slot="prefix" name="trash"></sl-icon>
                            </sl-menu-item>
                        </sl-menu>
                    </sl-dropdown>
                </div>
            </div>
            <sl-dialog label="Cambiar nombre" id="editNameDialog" class="dialog-overview">
                <form id="listForm">
                    <div class="note-container">
                        <sl-input class="form-input" autocomplete="off" name="name" placeholder="Ingresa el nombre de la lista" size="large" value="${list.nombre}" required></sl-input>
                    </div>
                </form>
                <sl-button class="btn" id="editNameBtn" form="listForm" slot="footer" variant="primary" type="submit">Guardar nota</sl-button>
            </sl-dialog>
            <sl-dialog label="¿Estás seguro de que deseas eliminar esta lista?" id="deleteConfirmationDialog" class="dialog-overview">
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

    initEvents() {
        const backBtn = document.querySelector("#backBtn");

        backBtn.addEventListener("click", () => {
            window.history.pushState({}, '', '/lists');
            router(routes);
        });

        try {
            const featureBtn = document.querySelector("#destacarLista");
            const deleteBtn = document.querySelector("#eliminarLista");
            const deleteConfirmationDialog = document.querySelector("#deleteConfirmationDialog");
            const deleteConfirmationBtn = document.querySelector("#deleteBtn");
            const cancelBtn = document.querySelector("#cancelBtn");
            const editName = document.querySelector("#cambiarNombre");
            const editNameDialog = document.querySelector("#editNameDialog");
            const form = document.querySelector('#listForm');
            const nameContainer = document.querySelector(".list-name");

            featureBtn.addEventListener("click", async () => {
                const featureBtnIcon = featureBtn.querySelector("sl-icon");
                if (featureBtnIcon.getAttribute("name") === "bookmark") {

                    const featuredLists = this.lists.filter(l => l.destacada);
                    if (featuredLists.length === 5) {
                        Toast({
                            text: "Solo puede haber un máximo de 5 listas destacadas.",
                            duration: 5000,
                            close: true,
                            gravity: "bottom",
                            stopOnFocus: false,
                            className: "danger",
                        });
                    } else {
                        await this.list.update({
                            destacada: true
                        });
                        featureBtn.innerHTML = `Eliminar de destacados<sl-icon slot="prefix" name="bookmark-dash"></sl-icon>`;
                        featureBtn.blur();
                        Toast({
                            text: "¡Lista destacada con éxito! Ahora podrás ver esta lista en la pantalla principal.",
                            duration: 5000,
                            close: true,
                            gravity: "bottom",
                            stopOnFocus: false,
                            className: "success",
                        });
                    }

                } else if ((featureBtnIcon.getAttribute("name") === "bookmark-dash")) {
                    //const eList = await Lista.getById(this.list.idUsuario, this.list.id);
                    await this.list.update({
                        destacada: false
                    });

                    featureBtn.innerHTML = `Destacar<sl-icon slot="prefix" name="bookmark"></sl-icon>`;
                    featureBtn.blur();
                    Toast({
                        text: "Ya no podrás ver esta lista en la pantalla principal.",
                        duration: 5000,
                        close: true,
                        gravity: "bottom",
                        stopOnFocus: false,
                        className: "success",
                    });
                }
            })

            deleteBtn.addEventListener("click", () => {
                deleteConfirmationDialog.show();
                deleteBtn.blur();
            })

            deleteConfirmationBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                await Lista.delete(this.list.id);


                deleteConfirmationDialog.hide();
                deleteConfirmationBtn.blur();

                window.history.pushState({}, '', '/lists');
                router(routes);

                Toast({
                    text: "Lista eliminada exitosamente.",
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

            editName.addEventListener("click", () => {
                editNameDialog.show();
                document.body.style.overflow = 'hidden';
            })

            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                if (!form.reportValidity()) {
                    console.log("Formulario no válido.");
                    return;
                }

                const formData = new FormData(form);
                const eList = await Lista.getById(this.list.idUsuario, this.list.id);
                await eList.update({
                    nombre: formData.get('name').toString()
                });

                document.body.style.overflow = 'auto';
                nameContainer.innerHTML = formData.get('name').toString();
                editNameDialog.hide();

                Toast({
                    text: "Lista actualizada exitosamente.",
                    duration: 3000,
                    close: true,
                    gravity: "bottom",
                    stopOnFocus: false,
                    className: "success",
                });
            });
        } catch (e) {
            console.error(e);
        }
    }
}
