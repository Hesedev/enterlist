// public/src/state/index.js
import Store from './store.js';
import mutations from './mutations.js';
import actions from './actions.js';

const store = new Store(mutations, actions);

export default store;
