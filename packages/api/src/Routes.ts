import UserController from "./user/UserController";
import myContainer from "./inversify.config";
import { DEP_TYPES } from "./shared/CustomTypes";
import TodosController from "./todos/TodosController";
import AuthController from "./auth/AuthController";
import UserService from "./user/UserService";
import { createUserSchema } from "./user/UserSchemas";

const todosController = myContainer.get<TodosController>(
  DEP_TYPES.TodosController
);
const userController: any = myContainer.get<UserController>(
  DEP_TYPES.UserController
);

const authController: any = myContainer.get<AuthController>(
  DEP_TYPES.AuthController
);

console.log("auth routes", authController.routes());

const Routes = {
  name: "Routes",
  version: "1.0",
  register: async (server: any) => {
    server.route([
      {
        method: "GET",
        path: "/todos",
        handler: todosController.findAll,
        config: { auth: false },
      },
    ]);

    server.route(userController.routes());
    server.route(authController.routes());
  },
};
export default Routes;
