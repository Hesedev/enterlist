import { doc, collection, addDoc, getDocs, query, where, getDoc, serverTimestamp, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db } from "../services/firebaseConfig.js";
import Pelicula from "./Pelicula.js";
import Serie from "./Serie.js";
import Libro from "./Libro.js";

export default class Lista {
    constructor({
        id = null,
        nombre,
        destacada = false,
        tipo,
        idUsuario,
        elementos = [],
        fechaCreacion = null,
    }) {
        this.id = id;
        this.nombre = nombre;
        this.destacada = destacada;
        this.tipo = tipo;
        this.idUsuario = idUsuario;
        this.fechaCreacion = (id === null) ? serverTimestamp() : fechaCreacion;
        this.elementos = elementos;
    }

    // Guardar una nueva lista en Firestore
    async save() {
        try {
            const listasRef = collection(db, "listas");
            const listaRef = await addDoc(listasRef, {
                nombre: this.nombre,
                destacada: this.destacada,
                tipo: this.tipo,
                idUsuario: this.idUsuario,
                elementos: this.elementos,
                fechaCreacion: this.fechaCreacion,
            })
            this.id = listaRef.id;
        } catch (error) {
            console.error('Error guardando la lista:', error);
        }
    }

    // Obtener una lista por ID y verificar que pertenezca al usuario
    static async getById(idUsuario, listaId) {
        try {
            const listaRef = doc(db, 'listas', listaId);
            const snapshot = await getDoc(listaRef);

            if (snapshot.exists() && snapshot.data().idUsuario === idUsuario) {
                let lista;
                lista = new Lista({
                    id: snapshot.id,
                    ...snapshot.data(),
                })
                lista.elementos = await lista.getElementos();
                return lista;
            }
            console.error('Lista no encontrada o no pertenece al usuario proporcionado');
            return null;
        } catch (error) {
            console.error('Error obteniendo lista por ID:', error);
            return null;
        }
    }

    // Actualizar una lista
    async update(fieldsToUpdate) {
        try {
            const listaRef = doc(db, 'listas', this.id);
            await updateDoc(listaRef, fieldsToUpdate);
        } catch (error) {
            console.error('Error actualizando la lista:', error);
        }
    }

    // Eliminar una lista
    static async delete(listaId) {
        try {
            const listaRef = doc(db, 'listas', listaId);
            await deleteDoc(listaRef);
        } catch (error) {
            console.error('Error eliminando la lista:', error);
        }
    }

    static async getAllLists(idUsuario) {
        try {
            const querySnapshot = await getDocs(
                query(
                    collection(db, 'listas'),
                    where('idUsuario', '==', idUsuario)
                )
            );

            let listas = [];
            for (const doc of querySnapshot.docs) {
                let list = new Lista({
                    id: doc.id,
                    ...doc.data(),
                    fechaCreacion: doc.data().fechaCreacion.toDate(),
                })
                // Crear la lista con los elementos
                list.elementos = await list.getElementos();
                listas.push(list);
            }
            return listas;
        } catch (error) {
            console.error('Error obteniendo todas las listas:', error);
            return [];
        }
    }

    // Agregar un elemento a la lista
    async addElemento(elemento) {
        if (!this.id) throw new Error("La lista debe estar guardada antes de agregar elementos.");
        const elementosRef = collection(doc(db, "listas", this.id), "elementos");

        const docRef = await addDoc(elementosRef, elemento.toFirestore());
        elemento.id = docRef.id; // Asignar el ID generado
        return elemento;
    }

    // Obtener todos los elementos de la lista
    async getElementos() {
        if (!this.id) throw new Error("La lista debe estar guardada antes de obtener elementos.");
        const elementosRef = collection(db, "listas", this.id, "elementos");
        const snapshot = await getDocs(elementosRef);

        let elementos = [];
        for (let doc of snapshot.docs) {
            elementos.push({
                id: doc.id,
                ...doc.data(),
                fechaAgregado: doc.data().fechaAgregado.toDate(),
                fechaInicio: doc.data().fechaInicio?.toDate() || null,
                fechaFin: doc.data().fechaFin?.toDate() || null,
            })
        }
        return elementos;
    }


    // Obtener todos los elementos de la lista
    async getElemento(elementoId) {
        if (!this.id) throw new Error("La lista debe estar guardada antes de obtener un elemento.");
        const elementoRef = doc(db, "listas", this.id, "elementos", elementoId);
        const snapshot = await getDoc(elementoRef);
        const elemento = Lista.getElementClass(this.tipo);

        if (snapshot.exists()) {
            return new elemento({
                id: snapshot.id,
                ...snapshot.data(),
                fechaAgregado: snapshot.data().fechaAgregado.toDate(),
                fechaInicio: snapshot.data().fechaInicio?.toDate() || null,
                fechaFin: snapshot.data().fechaFin?.toDate() || null,
            });
        } else {
            return null;
        }
    }

    // Actualizar un elemento de la lista
    async updateElemento(elementoId, fieldsToUpdate) {
        if (!this.id) throw new Error("La lista debe estar guardada antes de actualizar elementos.");
        const elementoRef = doc(db, "listas", this.id, "elementos", elementoId);
        await updateDoc(elementoRef, fieldsToUpdate);
    }

    // Eliminar un elemento de la lista
    async deleteElemento(elementoId) {
        if (!this.id) throw new Error("La lista debe estar guardada antes de eliminar elementos.");
        const elementoRef = doc(db, "listas", this.id, "elementos", elementoId);
        await deleteDoc(elementoRef);
    }

    static getElementClass(tipo) {
        const clase = {
            "Película": Pelicula,
            "Serie": Serie,
            "Libro": Libro,
            "Manga": Object,
            "Anime": Object,
            "Videojuego": Object,
            "Canción": Object,
            "Álbum": Object,
            "Podcast": Object,
            "Artista": Object,
        };
        return clase[tipo];
    }
}
