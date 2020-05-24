import mysql from "mysql";
import { promisifiedQuery } from "./shared/Utils";

const dbPoolSize = process.env.DB_POOL_SIZE
  ? parseInt(process.env.DB_POOL_SIZE)
  : 10;
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
export const pool = mysql.createPool({
  connectionLimit: dbPoolSize,
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName
});

export const connectDatabase = async () => {
  try {
    const [results, fields] = await promisifiedQuery(pool, {
      sql: "SELECT 1 + 1 as solution"
    });
    console.log(`The solution is: `, results[0].solution);
  } catch (e) {
    console.log("could not connect to database");
    console.log(e.stack);
    //throw new CustomError("Could not connect to database", serverUnavailable());
  }
};
