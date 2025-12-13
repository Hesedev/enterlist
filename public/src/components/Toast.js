export default function Toast(config, customIcon) {
    Toastify(config).showToast();

    const toastify = document.querySelector(`.toastify.${config.className}`);

    let iconName = "";
    switch (config.className) {
        case "success":
            iconName = "check2-circle";
            break;
        case "danger":
            iconName = "exclamation-octagon";
            break;
        case "alert":
        case "warning":
            iconName = "exclamation-triangle";
            break;
        case "primary":
            iconName = "info-circle";
            break;
        case "neutral":
            iconName = "gear";
            break;
        default:
            iconName = "bell";
            break;
    }

    const icon = Object.assign(document.createElement('sl-icon'), {
        name: (customIcon) ? customIcon : iconName,
    });
    toastify.prepend(icon);
}
