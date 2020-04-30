import { QueryOptions, Pool, MysqlError, FieldInfo } from "mysql";
type queryCallbackParams = [MysqlError | null, any, FieldInfo[] | undefined];
export const promisifiedQuery = (
  connection: Pool,
  queryObject: QueryOptions
): Promise<queryCallbackParams> => {
  return new Promise((resolve, reject): void => {
    connection.query(queryObject, (error, results, fields) => {
      if (!error) resolve([error, results, fields]);
      else reject([error, results, fields]);
    });
  });
};
