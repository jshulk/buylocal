import Hapi from "@hapi/hapi";
//import Configue from "configue";
import Routes from "./Routes";
import { connectDatabase } from "./Database";

//const configue = new Configue();
console.log("abc");

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: "0.0.0.0"
  });

  server.route({
    method: "GET",
    path: "/",
    handler: () => {
      return "Hello World";
    }
  });

  connectDatabase();

  await server.register([{ plugin: Routes }], {
    routes: { prefix: "/api" }
  });

  await server.start();
  console.log("Server is running on %s", server.info.uri);
};

process.on("unhandledRejection", err => {
  console.log("unhandledRejection");
  console.log(err);
  process.exit(1);
});

init();
