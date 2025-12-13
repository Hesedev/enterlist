export default class List {
    constructor() {

    }

    render(list) {
        const elementos = list.elementos.sort((a, b) => new Date(a.fechaAgregado) - new Date(b.fechaAgregado));
        return `
        <a class="list-box" href="/list/${list.id}" data-link>
            <div class="list-box-image">
                <img src="${([...elementos].pop()?.urlImagen)
                ? [...elementos].pop().urlImagen
                : "../assets/img/no-image-found.jpg"}" 
                    alt="Portada de la Lista" loading="lazy">
                <div class="list-info">
                    ${this.renderStatus(list.tipo)}
                    <span>${(elementos.length > 0) ? elementos.length : 0}</span>
                </div>
            </div>
            <h2 class="list-title">${list.nombre}</h2>
        </a>
        `
    }

    renderStatus(type) {
        if (type === "Película") {
            return '<sl-icon library="boxicons" name="bx-movie"></sl-icon>';
        } else if (type === "Serie") {
            return '<sl-icon library="boxicons" name="bx-tv"></sl-icon>';
        } else if (type === "Manga") {
            return '<sl-icon name="book-half"></sl-icon>';
        } else if (type === "Anime") {
            return '<sl-icon name="tv"></sl-icon>';
        } else if (type === "Libro") {
            return '<sl-icon library="boxicons" name="bx-book"></sl-icon>';
        } else if (type === "Canción") {
            return '<sl-icon library="boxicons" name="bx-music"></sl-icon>';
        } else if (type === "Podcast") {
            return '<sl-icon name="broadcast-pin"></sl-icon>';
        } else if (type === "Álbum") {
            return '<sl-icon name="disc"></sl-icon>';
        } else if (type === "Artista") {
            return '<sl-icon library="boxicons" name="bx-microphone"></sl-icon>';
        } else if (type === "Videojuego") {
            return '<sl-icon name="controller"></sl-icon>';
        } else if (type === "Enlace") {
            return '<sl-icon library="boxicons" name="bx-link"></sl-icon>';
        } else if (type === "Personalizado") {
            return '<sl-icon library="boxicons" name="bx-list-ul"></sl-icon>';
        }
    }
}