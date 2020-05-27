import mysql from "mysql";
import { promisifiedQuery } from "./shared/Utils";

const {
  DB_POOL_SIZE: dbPoolSize = 10,
  DB_HOST: dbHost = "localhost",
  DB_USER: dbUser,
  DB_PASSWORD: dbPassword,
  DB_NAME: dbName,
} = process.env;
console.log("dbUser", dbUser);
console.log("dbPassword", dbPassword);
export const pool = mysql.createPool({
  connectionLimit: +dbPoolSize,
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
});

export const connectDatabase = async () => {
  try {
    const [results, fields] = await promisifiedQuery(pool, {
      sql: "SELECT 1 + 1 as solution",
    });
    console.log(`The solution is: `, results[0].solution);
  } catch (e) {
    console.log("could not connect to database");
    console.log(e.stack);
    //throw new CustomError("Could not connect to database", serverUnavailable());
  }
};
