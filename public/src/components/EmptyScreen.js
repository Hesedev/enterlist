export default class EmptyScreen {
    constructor() {

    }

    render(icon, message) {
        return `
            <div class="empty-page">
                <div class="icon-wrapper">
                    <sl-icon name="${icon}"></sl-icon>
                </div>
                <h2 class="message">${message}</h2>
            </div>
        `;
    }
}