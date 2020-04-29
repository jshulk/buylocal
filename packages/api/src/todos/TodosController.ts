import TodoDao from "./TodoDaoInterface";

class TodosController {
  private static instance: TodosController;
  private constructor() {}
  public static getInstance() {
    if (!TodosController.instance) {
      this.instance = new TodosController();
    }
    return this.instance;
  }
  async findAll(): Promise<TodoDao[]> {
    return [{ id: "1234", title: "Learn Hapi" }];
  }
}

export default TodosController.getInstance();
