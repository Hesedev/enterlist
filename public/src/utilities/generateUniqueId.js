import { auth } from "../services/firebaseConfig.js";

// Método para generar el ID único
export default function generateUniqueId() {
    const user = auth.currentUser;  // Obtiene el usuario actual, si está autenticado

    // Verifica si hay un usuario autenticado
    if (!user) {
        throw new Error("Usuario no autenticado");
    }

    // Si el usuario está autenticado, generamos el ID único
    const randomValues = new Uint8Array(5);  // 5 bytes = 40 bits de aleatoriedad
    crypto.getRandomValues(randomValues);

    const randomHex = Array.from(randomValues)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');

    const timestamp = Date.now();
    const userId = user.uid;  // El UID del usuario autenticado

    // Combina el valor aleatorio, el timestamp y el userId
    const uniqueId = (randomHex + timestamp + userId).slice(0, 10);

    return uniqueId;  // Devuelve el ID único generado
}

