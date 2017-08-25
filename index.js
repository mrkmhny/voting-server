import makeStore from './src/store.js';
import startServer from './src/server.js'

export const store = makeStore();
startServer(store);
