export default class Error404 {
    constructor() {
        this.docTitle = "404 | página no encontrada";
    }

    render() {
        return `
        <div class="text">
            <div>ERROR</div>
            <h1>404</h1>
            <hr>
            <div>Página No Encontrada.</br><a href="/" data-link>[[ Volver a Enterlist ]]</a></div>
        </div>

        <div class="astronaut">
            <img src="/assets/img/isolated-astronaut.svg" alt="Isolated Astronaut" class="src" loading="lazy">
        </div>
        `;
    }

    initEvents() {
        const d = document;
        const b = d.body;
        setInterval(createStar, 100);

        function createStar() {
            var right = Math.random() * 500;
            var top = Math.random() * screen.height;
            var star = d.createElement("div");
            star.classList.add("star")
            b.appendChild(star);
            setInterval(runStar, 10);
            star.style.top = top + "px";
            function runStar() {
                if (right >= screen.width) {
                    star.remove();
                }
                right += 3;
                star.style.right = right + "px";
            }
        }
    }

    initialize() {
        document.querySelector("title").innerText = this.docTitle;
        document.querySelector("#app").innerHTML = this.render();
        this.initEvents();
        document.querySelector("header").innerHTML = "";
    }
}