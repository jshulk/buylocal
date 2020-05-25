import { Controller, Post, RouteConfig } from "../shared/decorators";
import { loginSchema } from "./AuthSchema";
import { injectable, inject } from "inversify";
import UserService from "../user/UserService";
import { DEP_TYPES, CustomError } from "../shared/CustomTypes";
import { Request } from "@hapi/hapi";
import UserDto from "../user/UserDto";
@Controller("/auth")
@injectable()
class AuthController {
  private userService: UserService;
  constructor(@inject(DEP_TYPES.UserService) userService: UserService) {
    this.userService = userService;
  }

  @Post("/login", { validate: { payload: loginSchema } })
  @RouteConfig({ auth: false })
  async login(request: Request): Promise<UserDto> {
    try {
      const payload: UserDto = UserDto.createFromRequest(
        <UserDto>request.payload
      );
      return await this.userService.authenticate(
        <string>payload.email,
        <string>payload.password
      );
    } catch (error) {
      if (error.boomInstance) throw error.boomInstance;
      else throw new CustomError(error.message).boomInstance;
    }
  }
}

export default AuthController;
