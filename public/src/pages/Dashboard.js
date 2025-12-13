import store from '../state/index.js';
import Carousel from '../components/Carousel.js';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
import EmptyScreen from '../components/EmptyScreen.js';
import dashboardHeader from '../components/dashboardHeader.js';
import Lista from '../models/Lista.js';

export default class Dashboard {
    constructor() {
        this.docTitle = "Enterlist";
        this.user = store.state.user;
        this.header = new dashboardHeader();
        this.carousel = new Carousel();
        this.emptyscreen = new EmptyScreen();
    }

    async initialize() {
        const lists = await Lista.getAllLists(this.user.uid);
        this.favLists = lists.filter(l => l.destacada == true).slice(0, 5);

        const d = document;
        d.querySelector("title").innerText = this.docTitle;
        d.querySelector('header').innerHTML = this.header.render();
        this.header.initEvents();
        d.querySelector("#app").innerHTML = this.render();
        this.initEvents();
    }

    render() {
        if (this.favLists.length > 0 && !(this.favLists.length === 1 && this.favLists[0].elementos.length === 0)) {
            return `
            <section class="carousel">
                ${this.favLists.map(list =>
                (list.elementos.length > 0) ? `
                    <div class="heading">
                        <h2 class="heading-title">${list.nombre}</h2>
                        <!--Swipper Navigation Buttons-->
                        <a href="/list/${list.id}" class="heading-see-all-btn">
                            Ver todos
                            <sl-icon library="boxicons" name="bx-chevron-right"></sl-icon>
                        </a>
                    </div>
                    ${this.carousel.render(list)}`
                    : "").join('')}
            </section>        
        `;
        } else {
            return this.emptyscreen.render("inbox", "Marca listas como destacadas para verlas en la página principal.");
        }
    }

    initEvents() {
        const swiper1 = new Swiper(".carousel-content-2-3", {
            slidesPerView: 1,
            spaceBetween: 10,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                200: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                },
                320: {
                    slidesPerView: 3.5,
                    spaceBetween: 10,
                },
                510: {
                    slidesPerView: 4.5,
                    spaceBetween: 10,
                },
                758: {
                    slidesPerView: 5.5,
                    spaceBetween: 15,
                },
                900: {
                    slidesPerView: 6.5,
                    spaceBetween: 20,
                },
            },
        });

        const swiper2 = new Swiper(".carousel-content-1-1", {
            slidesPerView: 1,
            spaceBetween: 10,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                200: {
                    slidesPerView: 1.5,
                    spaceBetween: 10,
                },
                320: {
                    slidesPerView: 2.5,
                    spaceBetween: 10,
                },
                510: {
                    slidesPerView: 3.5,
                    spaceBetween: 10,
                },
                758: {
                    slidesPerView: 4.5,
                    spaceBetween: 15,
                },
                900: {
                    slidesPerView: 5.5,
                    spaceBetween: 20,
                },
            },
        });
        const swiper3 = new Swiper(".carousel-content-16-9", {
            slidesPerView: 1,
            spaceBetween: 10,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                200: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                },
                320: {
                    slidesPerView: 1.5,
                    spaceBetween: 10,
                },
                510: {
                    slidesPerView: 2.5,
                    spaceBetween: 10,
                },
                758: {
                    slidesPerView: 3.5,
                    spaceBetween: 15,
                },
                900: {
                    slidesPerView: 4.5,
                    spaceBetween: 20,
                },
            },
        });
    }
}
