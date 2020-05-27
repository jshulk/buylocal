import { Controller, Post, Get } from "../shared/decorators";
import { loginSchema } from "./AuthSchema";
import { injectable, inject } from "inversify";
import UserService from "../user/UserService";
import { DEP_TYPES, CustomError } from "../shared/CustomTypes";
import { Request } from "@hapi/hapi";
import UserDto from "../user/UserDto";
import AuthService from "./AuthService";
@Controller("/auth")
@injectable()
class AuthController {
  private authService: AuthService;
  constructor(@inject(DEP_TYPES.AuthService) authService: AuthService) {
    this.authService = authService;
  }

  @Post("/login", {
    validate: { payload: loginSchema },
    auth: { mode: "try" },
  })
  async login(request: Request): Promise<UserDto> {
    try {
      const payload: UserDto = UserDto.createFromRequest(
        <UserDto>request.payload
      );

      const authenticatedUser: UserDto = await this.authService.authenticate(
        <string>payload.email,
        <string>payload.password
      );
      request.cookieAuth.set({ id: authenticatedUser.id });
      return authenticatedUser;
    } catch (error) {
      console.log("error", error);
      if (error.boomInstance) throw error.boomInstance;
      else throw new CustomError(error.message).boomInstance;
    }
  }

  @Get("/logout")
  async logout(request: Request): Promise<object> {
    request.cookieAuth.clear();
    return { message: "User logged out" };
  }
}

export default AuthController;
