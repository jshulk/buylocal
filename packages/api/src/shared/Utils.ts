import {
  QueryOptions,
  Pool,
  MysqlError,
  FieldInfo,
  Connection,
  PoolConnection
} from "mysql";
import { CustomError } from "./CustomTypes";
type queryCallbackParams = [any, FieldInfo[] | undefined];
export const promisifiedQuery = (
  connection: Pool | Connection,
  queryObject: QueryOptions
): Promise<queryCallbackParams> => {
  return new Promise((resolve, reject): void => {
    const query = connection.query(queryObject, (error, results, fields) => {
      console.log("sql", query.sql);
      if (!error) resolve([results, fields]);
      else reject(error);
    });
  });
};

export const promisifiedConnection = (
  pool: Pool
): Promise<[MysqlError | null, null | PoolConnection]> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject([err, null]);
      else resolve([null, connection]);
    });
  });
};

export const awaitWithError = (promise: Promise<any>): Promise<any> => {
  return promise.then(res => [null, res]).catch(err => [err, null]);
};
