import { doc, collection, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db } from '../services/firebaseConfig.js';

export default class Usuario {
  constructor({
    id,
    nombre,
    email,
    fotoPerfil = null,
    proveedor,
    fechaCreacion = null,
  }) {
    this.id = id; // El UID de Firebase Auth
    this.nombre = nombre;
    this.email = email;
    this.fotoPerfil = fotoPerfil;
    this.proveedor = proveedor;
    this.fechaCreacion = fechaCreacion;
  }

  // Guardar un nuevo usuario en Firestore
  async save() {
    try {
      if (!this.id) {
        console.error('El ID del usuario (uid de Firebase Auth) es requerido');
        return;
      }

      const usuarioRef = doc(db, 'usuarios', this.id);
      await setDoc(usuarioRef, {
        nombre: this.nombre,
        email: this.email,
        fotoPerfil: this.fotoPerfil,
        proveedor: this.proveedor,
        fechaCreacion: serverTimestamp() // Fecha generada por el servidor de Firestore
      });
    } catch (error) {
      console.error('Error guardando el usuario:', error);
    }
  }

  // Obtener un usuario por ID
  static async getById(usuarioId) {
    try {
      const usuarioRef = doc(db, 'usuarios', usuarioId);
      const snapshot = await getDoc(usuarioRef);
      if (snapshot.exists()) {
        return new Usuario({ id: snapshot.id, ...snapshot.data() });
      } else {
        console.error('Usuario no encontrado');
        return null;
      }
    } catch (error) {
      console.error('Error obteniendo usuario por ID:', error);
    }
  }

  // Actualizar usuario (campos específicos)
  async update(fieldsToUpdate) {
    try {
      const usuarioRef = doc(db, 'usuarios', this.id);
      await updateDoc(usuarioRef, fieldsToUpdate);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
  }

  // Eliminar un usuario
  static async delete(usuarioId) {
    try {
      const usuarioRef = doc(db, 'usuarios', usuarioId);
      await deleteDoc(usuarioRef);
    } catch (error) {
      console.error('Error eliminando usuario:', error);
    }
  }
}
