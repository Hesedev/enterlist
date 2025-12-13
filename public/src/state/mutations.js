// public/src/state/mutations.js

export default {
    /**
     * Establece el estado del usuario en el almacén de datos.
     * @param {object} state - El objeto de estado global.
     * @param {object|null} user - El objeto de usuario de Firebase o null si no está autenticado.
     */
    setUser(state, user) {
        state.user = user;
    },

    /**
     * Actualiza una propiedad específica del perfil del usuario.
     * @param {object} state - El objeto de estado global.
     * @param {object} profileUpdates - Un objeto con las propiedades a actualizar (ej. { displayName: 'Nuevo Nombre' }).
     */
    updateUserProfile(state, profileUpdates) {
        if (state.user) {
            state.user = { ...state.user, ...profileUpdates };
        }
    }
};
