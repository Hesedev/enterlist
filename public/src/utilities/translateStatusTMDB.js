export const translateMovieStatus = (status) => {
    const translations = {
        "Released": "Estrenada",
        "In Production": "En Producción",
        "Post Production": "Post Producción",
        "Planned": "Planificada",
        "Canceled": "Cancelada",
    };
    return translations[status] || status;
};

export const translateTvStatus = (status) => {
    const translations = {
        "Returning Series": "En emisión",
        "Planned": "Planificada",
        "In Production": "En producción",
        "Ended": "Finalizada",
        "Canceled": "Cancelada",
        "Pilot": "Piloto",
    };
    return translations[status] || status;
};