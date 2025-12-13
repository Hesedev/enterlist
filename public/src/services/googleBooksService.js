import { normalizeBookData } from "./normalizeData.js";

export async function fetchBookByName(query) {
    try {
        const response = await fetch(`https://fetchbookbyname-6rwliplava-uc.a.run.app?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        console.log(data)
        return data.map(normalizeBookData);
    } catch (error) {
        console.error('Error al buscar libros:', error);
        return [];
    }
}

export async function fetchBookDetails(id) {
    try {
        const response = await fetch(`https://fetchbookbyid-6rwliplava-uc.a.run.app?libroId=${id}`);
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Error al buscar el libro:', error);
        return [];
    }
}