import Elemento from "./Elemento.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { translateMovieStatus } from '../utilities/translateStatusTMDB.js';

export default class Pelicula extends Elemento {
    constructor({
        originalId = null,
        estadoTMDB,
        genero = [],
        duracion = 0,
        ultimaFechaActualizacion = null,
        fechaSalida = null,
        ...args
    }) {
        super(args);
        this.originalId = originalId;
        this.estadoTMDB = translateMovieStatus(estadoTMDB);
        this.genero = genero;
        this.duracion = duracion;
        this.fechaSalida = fechaSalida;
    }

    toFirestore() {
        return {
            ...super.toFirestore(),
            originalId: this.originalId,
            estadoTMDB: this.estadoTMDB,
            genero: this.genero,
            duracion: this.duracion,
            fechaSalida: this.fechaSalida,
        };
    }

    getMetaData() {
        return [
            {
                key: "Año",
                value: (new Date(this.fechaSalida)).getFullYear()
            },
            {
                key: "Duración",
                value: `${this.duracion} mins`
            },
            {
                key: "Estado",
                value: this.estadoTMDB
            }
        ];
    }

    getInfo() {
        return [
            {
                key: "Descripción",
                value: this.descripcion
            },
            {
                key: "Género",
                value: this.genero.join(', ')
            },
        ];
    }
}
