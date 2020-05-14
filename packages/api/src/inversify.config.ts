import { Container } from "inversify";
import { DEP_TYPES } from "./shared/CustomTypes";
import UserService from "./user/UserService";
import UserServiceImpl from "./user/UserServiceImpl";
import TodosController from "./todos/TodosController";
import UserController from "./user/UserController";
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
  .bind<UserDao>(DEP_TYPES.UserDao)
  .to(UserDao)
  .inSingletonScope();
export default myContainer;
