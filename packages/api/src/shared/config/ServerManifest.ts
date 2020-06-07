import Routes from "../../plugins/Routes";
import Catbox from "@hapi/catbox";
import Vision from "@hapi/vision";
import CatboxRedis from "@hapi/catbox-redis";
import Authentication from "../../plugins/Authentication";
import YarAuthSchemePlugin from "../../plugins/YarAuthSchemePlugin";
const { REDIS_HOST, REDIS_PORT } = process.env;
const API_PREFIX = "/api";

require("@babel/register")({
  presets: ["@babel/preset-react", "@babel/preset-env"],
});
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
    plugins: [
      // { plugin: require("@hapi/cookie") },
      { plugin: YarAuthSchemePlugin },
      { plugin: Authentication, options: { prefix: API_PREFIX } },
      { plugin: Routes },
      { plugin: Vision },
    ],
    options: {
      routes: { prefix: API_PREFIX },
    },
  },
};
export default ServerManifest;
