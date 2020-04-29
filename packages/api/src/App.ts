import Hapi from "@hapi/hapi";
import Routes from "./Routes";
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

  await server.register([{ plugin: Routes }], {
    routes: { prefix: "/api/v1" }
  });

  await server.start();
  console.log("Server is running on %s", server.info.uri);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
