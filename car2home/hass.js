import {
    Auth,
    createConnection,
    subscribeEntities,
    createLongLivedTokenAuth,
} from "index.js";

const token = require('./token.json');
(async () => {
const auth = createLongLivedTokenAuth(
    "http://192.168.219.108:8123",
    token.access_token
);

const connection = await createConnection({ auth });
subscribeEntities(connection, (entities) => console.log(entities));
})();

connect();