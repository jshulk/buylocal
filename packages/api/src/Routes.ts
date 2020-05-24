import UserController from "./user/UserController";
import myContainer from "./inversify.config";
import { DEP_TYPES } from "./shared/CustomTypes";
import TodosController from "./todos/TodosController";
import UserService from "./user/UserService";
import { createUserSchema } from "./user/UserSchemas";

const todosController = myContainer.get<TodosController>(
  DEP_TYPES.TodosController
);
const userController: any = myContainer.get<UserController>(
  DEP_TYPES.UserController
);

console.log("user routes", userController.routes());

const userService = myContainer.get<UserService>(DEP_TYPES.UserService);
const Routes = {
  name: "Routes",
  version: "1.0",
  register: async (server: any) => {
    server.route([
      {
        method: "GET",
        path: "/todos",
        handler: todosController.findAll,
      },
    ]);

    server.route(userController.routes());
  },
};
export default Routes;
