import Elemento from "./Elemento.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

export default class Libro extends Elemento {
    constructor({
        originalId,
        categoria = [],
        autor = [],
        paginas,
        editorial = "Indefinido",
        ultimaFechaActualizacion = null,
        fechaSalida = null,
        ...args
    }) {
        super(args);
        this.originalId = originalId;
        this.categoria = categoria;
        this.autor = autor;
        this.paginas = paginas;
        this.editorial = editorial;
        this.fechaSalida = fechaSalida;
    }

    toFirestore() {
        return {
            ...super.toFirestore(),
            originalId: this.originalId,
            categoria: this.categoria,
            autor: this.autor,
            paginas: this.paginas,
            editorial: this.editorial,
            fechaSalida: this.fechaSalida,
        };
    }
    // Para que funcione hay que agregar la nueva clase en el metodo getClass de lista
    getMetaData() {
        return [
            {
                key: "Año",
                value: (new Date(this.fechaSalida)).getFullYear()
            },
            {
                key: "Páginas",
                value: (this.paginas > 1)
                    ? `${this.paginas} páginas`
                    : `${this.paginas} página`,
            },
        ];
    }

    getInfo() {
        return [
            {
                key: "Descripción",
                value: this.descripcion
            },
            {
                key: "Autores",
                value: this.autor.join(', ')
            },
            {
                key: "Categorías",
                value: this.categoria.join(', ')
            },
            {
                key: "Editorial",
                value: this.editorial,
            },
        ];
    }
}
