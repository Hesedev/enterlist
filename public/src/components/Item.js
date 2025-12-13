export default class Item {
    constructor() {

    }

    render(item, list, dimensions) {
        return `
            <a class="item-box" data-link href="/list/${list.id}/item/${item.id}">
                <div class="item-box-image-${dimensions}">
                    <img src="${item.urlImagen ? item.urlImagen : "../assets/img/no-image-found.jpg"}" alt="${item.nombre}" loading="lazy">
                </div>
                <div class="item-details">
                    ${this.renderCalification(item.calificacion)}
                    <span class="progress">
                        ${this.renderStatus(item.estado)}
                    </span>
                </div>
                <h2 class="item-title">${item.titulo}</h2>
            </a>
        `
    }

    renderCalification(calification) {
        return (calification > 0) ? `<span class="score-label">${calification}★</span>` : "";
    }

    renderStatus(status) {
        const realStatus = this.getRealStatus(status);

        if (realStatus === "Pendiente") {
            return '<sl-icon name="clock"></sl-icon>';
        } else if (realStatus === "En progreso") {
            return '<sl-icon name="clock-history"></sl-icon>';
        } else {
            return '<sl-icon name="check-lg"></sl-icon>';
        }
    }


    getRealStatus(status) {
        if (status === "Pendiente") {
            return "Pendiente";
        } else if (status === "Viendo" || status === "Leyendo" || status === "Escuchando" || status === "Jugando") {
            return "En progreso";
        } else {
            return "Completado";
        }
    }
}