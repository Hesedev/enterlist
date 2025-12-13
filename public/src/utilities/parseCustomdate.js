export default function parseCustomDate(dateString) {
    const months = {
        "enero": 0, "febrero": 1, "marzo": 2, "abril": 3,
        "mayo": 4, "junio": 5, "julio": 6, "agosto": 7,
        "septiembre": 8, "octubre": 9, "noviembre": 10, "diciembre": 11
    };

    // Extraer las partes de la cadena
    const dateTimeRegex = /(\d{1,2}) de (\w+) de (\d{4}), (\d{1,2}):(\d{2}):(\d{2})\s([ap]\.m\.)\sUTC([+-]\d+)/;
    const match = dateString.match(dateTimeRegex);

    if (!match) {
        throw new Error("Formato de fecha no válido");
    }

    // Desestructurar las partes
    const [, day, monthName, year, hour, minute, second, period, offset] = match;

    // Convertir las partes en valores numéricos
    const month = months[monthName.toLowerCase()];
    let parsedHour = parseInt(hour, 10);
    if (period === "p.m." && parsedHour !== 12) {
        parsedHour += 12; // Convertir PM al formato 24 horas
    } else if (period === "a.m." && parsedHour === 12) {
        parsedHour = 0; // Medianoche es 00 horas
    }

    // Crear el objeto Date en UTC
    const date = new Date(Date.UTC(
        parseInt(year, 10),
        month,
        parseInt(day, 10),
        parsedHour,
        parseInt(minute, 10),
        parseInt(second, 10)
    ));

    // Aplicar la zona horaria (offset)
    const timezoneOffset = parseInt(offset, 10) * 60; // Offset en minutos
    date.setUTCMinutes(date.getUTCMinutes() - timezoneOffset);

    return date;
}
