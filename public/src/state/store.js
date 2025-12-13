// public/src/state/store.js

export default class Store {
    constructor(mutations, actions) {
        this.mutations = mutations;
        this.actions = actions;
        this.state = new Proxy({}, {
            set: (target, key, value) => {
                target[key] = value;
                this.notify(key, value);
                return true;
            }
        });
        this.observers = {};
    }

    /**
     * Permite a un componente suscribirse a cambios en una parte específica del estado.
     * @param {string} key - La clave del estado a la que suscribirse (ej. 'user').
     * @param {function} observer - La función que se ejecutará cuando el estado cambie.
     */
    subscribe(key, observer) {
        if (!this.observers[key]) {
            this.observers[key] = [];
        }
        this.observers[key].push(observer);
    }

    /**
     * Notifica a todos los suscriptores cuando una parte del estado ha cambiado.
     * @param {string} key - La clave del estado que cambió.
     * @param {*} value - El nuevo valor.
     */
    notify(key, value) {
        if (this.observers[key]) {
            this.observers[key].forEach(observer => observer(value));
        }
    }

    /**
     * Ejecuta una mutación para cambiar el estado de forma síncrona.
     * @param {string} name - El nombre de la mutación.
     * @param {*} payload - Los datos para la mutación.
     */
    commit(name, payload) {
        if (this.mutations[name]) {
            this.mutations[name](this.state, payload);
        }
    }

    /**
     * Ejecuta una acción, normalmente para operaciones asíncronas.
     * @param {string} name - El nombre de la acción.
     * @param {*} payload - Los datos para la acción.
     */
    dispatch(name, payload) {
        if (this.actions[name]) {
            return this.actions[name](this, payload);
        }
    }
}
