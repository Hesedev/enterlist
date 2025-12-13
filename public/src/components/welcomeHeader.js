export default class welcomeHeader {
    constructor() {
        this.headerElement = document.querySelector('header');
    }

    render() {
        return `
            <div class="nav container">
                <!--Logo-->
                <a href="/" data-link  class="logo">
                    <img src="/assets/logos/dark-theme/enterlist-imagotipo.png" alt="Enterlist" loading="lazy">
                </a>
            </div>
        `;
    }
}