import {
    Auth,
    createConnection,
    subscribeEntities,
    createLongLivedTokenAuth,
} from "./lib/index.js";

// const token = require('./token.json');
(async () => {
const auth = createLongLivedTokenAuth(
    "http://192.168.219.108:8123",
    ""
);

const connection = await createConnection({ auth });
subscribeEntities(connection, (entities) => console.log(entities));
})();