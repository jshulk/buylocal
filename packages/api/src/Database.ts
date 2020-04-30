import mysql from "mysql";
import { promisifiedQuery } from "./shared/Utils";
const dbUser = process.env.DB_USER || "twitter_app_user";
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME || "twitter";
const dbHost = process.env.DB_HOST || "db";

export const pool = mysql.createPool({
  connectionLimit: 10,
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName
});

export const connectDatabase = async () => {
  const [error, results, fields] = await promisifiedQuery(pool, {
    sql: "SELECT 1 + 1 as solution"
  });
  if (error) {
    console.log("error occurred", error);
  } else {
    console.log(`The solution is: `, results[0].solution);
  }

  //   pool.getConnection((err, connection) => {
  //     if (err) throw err;
  //     connection.query("SELECT 1 + 1 as solution", (error, results, fields) => {
  //       connection.release();
  //       if (error) {
  //         throw error;
  //       }
  //       console.log(`The solution is: `, results[0].solution);
  //     });
  //   });
};
