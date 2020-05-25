import { Container } from "inversify";
import { DEP_TYPES } from "./shared/CustomTypes";
import UserService from "./user/UserService";
import UserServiceImpl from "./user/UserServiceImpl";
import TodosController from "./todos/TodosController";
import UserController from "./user/UserController";
import AuthController from "./auth/AuthController";
import AuthUtils from "./auth/AuthUtils";
import UserDao from "./user/UserDao";

const myContainer = new Container();
myContainer
  .bind<UserService>(DEP_TYPES.UserService)
  .to(UserServiceImpl)
  .inSingletonScope();
myContainer
  .bind<TodosController>(DEP_TYPES.TodosController)
  .to(TodosController)
  .inSingletonScope();
myContainer
  .bind<UserController>(DEP_TYPES.UserController)
  .to(UserController)
  .inSingletonScope();
myContainer
  .bind<AuthController>(DEP_TYPES.AuthController)
  .to(AuthController)
  .inSingletonScope();
myContainer
  .bind<AuthUtils>(DEP_TYPES.AuthUtils)
  .to(AuthUtils)
  .inSingletonScope();
myContainer.bind<UserDao>(DEP_TYPES.UserDao).to(UserDao).inSingletonScope();
export default myContainer;
