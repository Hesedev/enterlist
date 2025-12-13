import Elemento from "./Elemento.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { translateTvStatus } from '../utilities/translateStatusTMDB.js';

export default class Serie extends Elemento {
    constructor({
        originalId,
        genero = [],
        estadoTMDB = null, // Valores comunes: "En emisión", "Finalizada", etc.
        temporadas = 0,
        episodios = 0,
        ultimaFechaActualizacion = null,
        fechaSalida = null,
        ...args
    }) {
        super(args);
        this.originalId = originalId;
        this.genero = genero;
        this.estadoTMDB = translateTvStatus(estadoTMDB);
        this.temporadas = temporadas;
        this.episodios = episodios;
        this.fechaSalida = fechaSalida;
    }

    toFirestore() {
        return {
            ...super.toFirestore(),
            originalId: this.originalId,
            genero: this.genero,
            estadoTMDB: this.estadoTMDB,
            temporadas: this.temporadas,
            episodios: this.episodios,
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
                key: "Temporadas",
                value: (this.temporadas > 1)
                    ? `${this.temporadas} temporadas`
                    : `${this.temporadas} temporada`,
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
            {
                key: "Episodios",
                value: (this.episodios > 1)
                    ? `${this.episodios} episodios`
                    : `${this.episodios} episodio`,
            },
        ];
    }
}
