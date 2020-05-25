import { Boom, forbidden, badImplementation } from "@hapi/boom";
import { MysqlError } from "mysql";

export type Maybe<T> = T | void;
export class CustomError extends Error {
  boomInstance?: Boom<any>;
  constructor(message: string, boomInstance?: Boom<any>) {
    super(message);
    this.boomInstance = boomInstance
      ? boomInstance
      : badImplementation(message);
  }
}
export class DBError extends CustomError {}
export class DuplicateRecordError extends CustomError {}
export class InvalidRequestError extends CustomError {}
export class UserCreationException extends CustomError {}
export class UserFetchException extends CustomError {}
export class UserDeleteException extends CustomError {}
export class RecordNotFoundError extends CustomError {}
export class InvalidCredentialsError extends CustomError {}
export class AuthenticationError extends CustomError {}
export type ThrowableMaybe<T> = T | CustomError;
export const DEP_TYPES = {
  UserService: Symbol("UserService"),
  TodosController: Symbol("TodosController"),
  UserController: Symbol("UserController"),
  UserDao: Symbol("UserDao"),
  AuthController: Symbol("AuthController"),
  AuthUtils: Symbol("AuthUtils"),
};
export const enum SQLError {
  DUPLICATE_RECORD = "ER_DUP_ENTRY",
}

export const isMysqlError = (object: any): object is MysqlError => {
  return object.sqlMessage !== undefined;
};
