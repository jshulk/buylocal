import UserDtoInterface from "./UserDtoInterface";
import { promisifiedQuery, promisifiedConnection } from "../shared/Utils";
import { pool } from "../Database";
import Dao from "../shared/DaoInterface";
import bcrypt from "bcrypt";
import UserDto from "./UserDto";
import { sign } from "jsonwebtoken";
import {
  ThrowableMaybe,
  DBError,
  SQLError,
  DuplicateRecordError,
  isMysqlError,
  RecordNotFoundError,
  CustomError,
  InvalidCredentialsError,
} from "../shared/CustomTypes";
import { injectable } from "inversify";
import "reflect-metadata";
import { Connection, PoolConnection } from "mysql";
import { connect } from "http2";
import { notFound } from "@hapi/boom";
const saltRounds = process.env.BCRYPT_SALT_ROUNDS
  ? parseInt(process.env.BCRYPT_SALT_ROUNDS)
  : 10;
const SIGNING_KEY: string = process.env.JWT_KEY || "DEFAULT_SIGNING_KEY";
@injectable()
export default class UserDao implements Dao<UserDto> {
  async find(id: number): Promise<UserDto> {
    console.log("id", id);
    const [err, connection] = await promisifiedConnection(pool);
    let conn = <PoolConnection>connection;
    try {
      const [fetchResult] = await promisifiedQuery(conn, {
        sql: "SELECT * from user where id = ?",
        values: [id],
      });
      console.log("fetchResult", fetchResult);
      if (fetchResult && fetchResult.length) {
        console.log("fetch results", fetchResult);
        return UserDto.createForView(fetchResult[0]);
      } else {
        throw new RecordNotFoundError("Record not found");
      }
    } catch (error) {
      if (isMysqlError(error)) {
        throw new DBError("Database Operation Failed");
      } else throw error;
    } finally {
      if (conn) {
        console.log("finally called");
        conn.release();
      }
    }
  }
  async findAll(query?: any): Promise<Array<UserDto>> {
    const [err, connection] = await promisifiedConnection(pool);
    let conn = <PoolConnection>connection;
    try {
      const [fetchResult] = await promisifiedQuery(conn, {
        sql: "SELECT * from user LIMIT " + query.pageSize,
      });
      console.log("fetchResult", fetchResult);
      return fetchResult.map((row: UserDtoInterface) =>
        UserDto.createForView(row)
      );
    } catch (error) {
      if (isMysqlError(error)) {
        throw new DBError("Database Operation Failed");
      } else throw error;
    } finally {
      if (conn) {
        conn.release();
        console.log("connection released");
      }
    }
  }
  async save(payload: UserDto): Promise<number> {
    const [err, connection] = await promisifiedConnection(pool);

    let conn = <PoolConnection>connection;
    try {
      const hashedPassword = await bcrypt.hash(
        <string>payload.password,
        saltRounds
      );
      const [insertResult] = await promisifiedQuery(conn, {
        sql: "INSERT INTO user SET ?",
        values: {
          email: payload.email,
          first_name: payload.first_name,
          last_name: payload.last_name,
          password: hashedPassword,
        },
      });
      const [fetchResult] = await promisifiedQuery(conn, {
        sql: "SELECT id from user where email = ?",
        values: [payload.email],
      });
      console.log("insertId", insertResult.insertId);
      if (fetchResult && fetchResult.length) {
        return fetchResult[0].id;
      } else {
        throw new DBError("Could not find the created user");
      }
    } catch (e) {
      console.log("came to catch");
      console.log(e);
      if (e && e.code === SQLError.DUPLICATE_RECORD) {
        throw new DuplicateRecordError(e.message);
      } else if (isMysqlError(e)) {
        throw new DBError("Database Operation Failed");
      } else throw e;
    } finally {
      if (conn) {
        console.log("finally called");
        conn.release();
      }
    }
  }
  async update(id: number, payload: UserDto): Promise<UserDto> {
    const [err, connection] = await promisifiedConnection(pool);

    let conn = <PoolConnection>connection;
    try {
      let hashedPassword = "";
      if (payload.password) {
        hashedPassword = await bcrypt.hash(
          <string>payload.password,
          saltRounds
        );
      }

      const [updateResult] = await promisifiedQuery(conn, {
        sql: "UPDATE user SET ? WHERE id = ?",
        values: [
          {
            ...(payload.email ? { email: payload.email } : {}),
            ...(payload.first_name ? { first_name: payload.first_name } : {}),
            ...(payload.last_name ? { last_name: payload.last_name } : {}),
            ...(payload.password ? { password: hashedPassword } : {}),
          },
          id,
        ],
      });

      const [fetchResult] = await promisifiedQuery(conn, {
        sql: "select * from user where id = ?",
        values: [id],
      });

      if (fetchResult && fetchResult.length) {
        return UserDto.createForView(fetchResult[0]);
      } else {
        throw new RecordNotFoundError("User Not Found", notFound());
      }
    } catch (error) {
      if (isMysqlError(error)) {
        throw new DBError("Could not update user");
      } else throw error;
    } finally {
      if (conn) {
        conn.release();
        console.log("connection released");
      }
    }
  }
  async delete(id: number): Promise<number> {
    const [err, connection] = await promisifiedConnection(pool);

    let conn = <PoolConnection>connection;
    try {
      const [deleteResult] = await promisifiedQuery(conn, {
        sql: "DELETE from user where id = ?",
        values: [id],
      });
      if (deleteResult.affectedRows === 0) {
        throw new RecordNotFoundError("User not found");
      }
      return id;
    } catch (error) {
      if (isMysqlError(error)) {
        throw new DBError("Could not delete user");
      } else throw error;
    } finally {
      if (conn) {
        conn.release();
        console.log("connection released");
      }
    }
  }

  async findByEmailPassword(email: string, password: string): Promise<UserDto> {
    const [err, connection] = await promisifiedConnection(pool);

    let conn = <PoolConnection>connection;
    try {
      const [fetchResult] = await promisifiedQuery(conn, {
        sql: "SELECT * from user WHERE email = ?",
        values: [email],
      });
      console.log("login", fetchResult);
      if (fetchResult && fetchResult.length) {
        const result = await bcrypt.compare(password, fetchResult[0].password);
        if (result) {
          return UserDto.createForLoginResponse({
            ...fetchResult[0],
            token: sign(fetchResult[0], SIGNING_KEY),
          });
        } else {
          throw new InvalidCredentialsError("Authentication Failed");
        }
      } else {
        throw new RecordNotFoundError("User not found");
      }
    } catch (error) {
      if (isMysqlError(error)) {
        throw new DBError("Query failed");
      } else {
        throw error;
      }
    } finally {
      if (conn) conn.release();
    }
  }
}
