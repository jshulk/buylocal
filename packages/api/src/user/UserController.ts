import { Request } from "@hapi/hapi";
import UserDto from "./UserDto";
import { injectable, inject } from "inversify";
import UserService from "./UserService";
import "reflect-metadata";
import { DEP_TYPES, InvalidRequestError } from "../shared/CustomTypes";
import { awaitWithError } from "../shared/Utils";
@injectable()
class UserController {
  private userService: UserService;
  constructor(@inject(DEP_TYPES.UserService) userService: UserService) {
    this.userService = userService;
  }
  create = async (request: Request): Promise<number | string> => {
    try {
      const newUser: UserDto = UserDto.createFromRequest(<UserDto>(
        request.payload
      ));
      const [err, createResponse] = await awaitWithError(
        this.userService.createUser(newUser)
      );
      if (err) throw err;
      console.log("createResponse", createResponse);
      return createResponse;
    } catch (error) {
      console.log("error", error);
      return error.message;
    }
  };
}
export default UserController;
