export default class Error404 {
    constructor() {
        this.docTitle = "Enterlist";
    }

    render() {
        return `
        <div class="image">
            <img src="/assets/img/under-construction.png" alt="under-construction">
        </div>
        `;
    }

    initEvents() {

    }

    initialize() {
        document.querySelector("title").innerText = this.docTitle;
        document.querySelector("#app").innerHTML = this.render();
        this.initEvents();
    }
}