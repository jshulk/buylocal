import Routes from "../../plugins/Routes";
import Catbox from "@hapi/catbox";
import CatboxRedis from "@hapi/catbox-redis";
import Authentication from "../../plugins/Authentication";
const { REDIS_HOST, REDIS_PORT } = process.env;
console.log("REDIS_HOST", REDIS_HOST);
const ServerManifest = {
  server: {
    port: 5000,
    host: "0.0.0.0",
    cache: [
      {
        name: "session_cache",
        provider: {
          constructor: CatboxRedis,
          options: {
            partition: "session_cache_data",
            host: REDIS_HOST,
            port: Number(REDIS_PORT),
            db: 0,
          },
        },
      },
    ],
  },
  register: {
    plugins: [{ plugin: Authentication }, { plugin: Routes }],
    options: {
      routes: { prefix: "/api" },
    },
  },
};
export default ServerManifest;
