import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { auth } from './firebaseConfig.js';
import Usuario from '../models/Usuario.js';

export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(async (result) => {
            // Maneja el resultado de la autenticación aquí
            const currentUser = result.user;
            const user = new Usuario({
                id: currentUser.uid,
                nombre: currentUser.displayName,
                email: currentUser.email,
                fotoPerfil: currentUser.photoURL,
                proveedor: currentUser.providerData[0].providerId
            })
            await user.save();
        })
        .catch((error) => {
            console.error("Error de autenticación:", error);
        });
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error al cerrar sesión: ", error);
        throw error;
    }
};

export const onAuthStateChangedHandler = async (callback) => {
    await onAuthStateChanged(auth, callback);
};