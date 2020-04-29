import TodosController from "./todos/TodosController";

const Routes = {
  name: "Routes",
  version: "1.0",
  register: async (server: any) => {
    server.route({
      method: "GET",
      path: "/todos",
      handler: TodosController.findAll
    });
  }
};
export default Routes;
