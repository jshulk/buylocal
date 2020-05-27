require("dotenv").config();
import Hapi from "@hapi/hapi";
import Glue from "@hapi/glue";
import { connectDatabase } from "./Database";
import container from "./inversify.config";
import AuthUtils from "./auth/AuthUtils";
import { DEP_TYPES } from "./shared/CustomTypes";
import ServerManifest from "./shared/config/ServerManifest";

//const configue = new Configue();

const options = { relativeTo: __dirname };
const init = async () => {
  const server = await Glue.compose(ServerManifest, options);

  server.route({
    method: "GET",
    path: "/",
    handler: () => {
      return "Hello World";
    },
  });

  connectDatabase();

  // server.auth.strategy("jwt", "jwt", {
  //   key: process.env.JWT_KEY,
  //   validate: authUtils.validateUser,
  //   verifyingOptions: {
  //     algorithms: ["HS256"],
  //     maxAge: TOKEN_AGE,
  //   },
  // });
  // server.auth.default("jwt");

  await server.start();
  console.log("Server is running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection");
  console.log(err);
  process.exit(1);
});

init();
