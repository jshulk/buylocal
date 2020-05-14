export type Maybe<T> = T | void;
export class CustomError {
  message: string;
  errorCode?: number;
  constructor(message: string, errorCode?: number) {
    this.message = message;
    this.errorCode = errorCode;
  }
}
export class DBError extends CustomError {}
export class InvalidRequestError extends CustomError {}
export class UserCreationException extends CustomError {}
export type ThrowableMaybe<T> = T | CustomError;
export const DEP_TYPES = {
  UserService: Symbol("UserService"),
  TodosController: Symbol("TodosController"),
  UserController: Symbol("UserController"),
  UserDao: Symbol("UserDao")
};
