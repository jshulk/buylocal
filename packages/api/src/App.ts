import Hapi from "@hapi/hapi";
//import Configue from "configue";
import Routes from "./Routes";
import { connectDatabase } from "./Database";
import container from "./inversify.config";
import AuthUtils from "./auth/AuthUtils";
import { DEP_TYPES } from "./shared/CustomTypes";
//const configue = new Configue();

const authUtils: AuthUtils = container.get<AuthUtils>(DEP_TYPES.AuthUtils);
const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: "0.0.0.0",
  });

  server.route({
    method: "GET",
    path: "/",
    handler: () => {
      return "Hello World";
    },
  });

  connectDatabase();

  await server.register(
    [{ plugin: Routes }, { plugin: require("hapi-auth-jwt2") }],
    {
      routes: { prefix: "/api" },
    }
  );
  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_KEY,
    validate: authUtils.validateUser,
  });
  server.auth.default("jwt");

  await server.start();
  console.log("Server is running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection");
  console.log(err);
  process.exit(1);
});

init();
