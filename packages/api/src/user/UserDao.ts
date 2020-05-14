import UserDtoInterface from "./UserDtoInterface";
import { promisifiedQuery, promisifiedConnection } from "../shared/Utils";
import { pool } from "../Database";
import Dao from "../shared/DaoInterface";
import UserDto from "./UserDto";
import { ThrowableMaybe, DBError } from "../shared/CustomTypes";
import { injectable } from "inversify";
import "reflect-metadata";
import { Connection, PoolConnection } from "mysql";

@injectable()
export default class UserDao implements Dao<UserDto> {
  get(id: number): ThrowableMaybe<UserDto> {
    return new UserDto({});
  }
  findAll(): ThrowableMaybe<Array<UserDto> | []> {
    return [];
  }
  async save(payload: UserDto): Promise<number> {
    const [err, connection] = await promisifiedConnection(pool);
    if (err) {
      throw new DBError("Could not get a connection");
    }
    let conn = <PoolConnection>connection;
    try {
      const [error, results, fields] = await promisifiedQuery(conn, {
        sql: "INSERT INTO user SET ?",
        values: {
          email: payload.email,
          first_name: payload.first_name,
          last_name: payload.last_name,
          password: payload.password
        }
      });
      if (error) {
        throw new DBError("Could not create user");
      } else {
        // Fetch the record by email id and return the id
        const [error, results, fields] = await promisifiedQuery(conn, {
          sql: "SELECT * from user where email = ?",
          values: [payload.email]
        });
        if (error) {
          throw new DBError("Could not fetch created user");
        }

        console.log("select result", results);
        // release the connection

        return results[0].id;
      }
    } catch (e) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  update(payload: UserDto): ThrowableMaybe<UserDto> {
    return new UserDto({});
  }
  delete(id: number): ThrowableMaybe<string> {
    return "Success";
  }
}
