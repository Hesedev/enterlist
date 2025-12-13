import Item from '../components/Item.js';

export default class Carousel {
    constructor() {
        this.itemComponent = new Item();
    }

    render(list) {
        const dimensions = this.getDimensions(list.tipo);
        const items = [...list.elementos].reverse().slice(0, 8);

        return `
            <div class="carousel-content-${dimensions} swiper">
                <div class="swiper-wrapper">
                    ${items.map(item => `
                        <div class="swiper-slide">
                            ${this.itemComponent.render(item, list, dimensions)}
                        </div>`).join('')}
                </div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        `;
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
}