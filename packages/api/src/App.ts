import Hapi from "@hapi/hapi";
import Routes from "./Routes";
import { connectDatabase } from "./Database";

const dbUser = process.env.DB_USER || "twitter_app_user";
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME || "twitter";
const dbHost = process.env.DB_HOST || "db";

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

  // try {
  //   const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  //     host: dbHost,
  //     dialect: "mysql"
  //   });
  //   await sequelize.authenticate();
  //   console.log("db connection successfull");
  // } catch (e) {
  //   console.log("db connection failed");
  //   console.log("error", e);
  // }

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
