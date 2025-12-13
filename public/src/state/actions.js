// public/src/state/actions.js
import { onAuthStateChangedHandler } from '../services/authService.js';

export default {
    /**
     * Inicia la escucha de cambios en el estado de autenticación de Firebase.
     * Cuando el estado cambia, ejecuta la mutación 'setUser'.
     * @param {object} store - La instancia del Store.
     */
    checkAuthState(store) {
        return new Promise((resolve) => {
            onAuthStateChangedHandler(user => {
                store.commit('setUser', user);
                resolve(user);
            });
        });
    }
};
