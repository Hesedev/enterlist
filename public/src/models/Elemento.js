import { serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

export default class Elemento {
    constructor({
        id = null,
        listaId,
        titulo,
        descripcion,
        urlImagen,
        url,
        favorito = false,
        nota = "",
        calificacion = 0,
        estado = "Pendiente",
        fechaAgregado = (id === null) ? serverTimestamp() : serverTimestamp(),
        fechaInicio = null,
        fechaFin = null
    }) {
        if (this.constructor === Elemento) {
            throw new Error("Elemento es una clase abstracta y no puede ser instanciada directamente.");
        }
        this.id = id;
        this.listaId = listaId;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.urlImagen = urlImagen;
        this.url = url;
        this.favorito = favorito;
        this.nota = nota;
        this.calificacion = calificacion;
        this.estado = estado;
        this.fechaAgregado = fechaAgregado;
        this.fechaInicio = fechaInicio,
            this.fechaFin = fechaFin
    }

    // Métodos comunes
    toFirestore() {
        return {
            listaId: this.listaId,
            titulo: this.titulo,
            descripcion: this.descripcion,
            urlImagen: this.urlImagen,
            url: this.url,
            favorito: this.favorito,
            nota: this.nota,
            calificacion: this.calificacion,
            estado: this.estado,
            fechaAgregado: this.fechaAgregado,
            fechaInicio: this.fechaInicio,
            fechaFin: this.fechaFin
        };
    }
}
