import UserService from "../user/UserService";
import { inject, injectable } from "inversify";
import { DEP_TYPES } from "../shared/CustomTypes";
import UserDto from "../user/UserDto";
import { Request } from "@hapi/hapi";
import { ValidateResponse } from "@hapi/cookie";

interface ValidationResponse {
  isValid: boolean;
}
@injectable()
class AuthUtils {
  private userService: UserService;
  constructor(@inject(DEP_TYPES.UserService) userService: UserService) {
    this.userService = userService;
  }
  validateUser = async (decoded: UserDto): Promise<ValidationResponse> => {
    console.log("decoded", decoded);
    try {
      const user: UserDto = await this.userService.find(decoded.id);
      return { isValid: user ? true : false };
    } catch (error) {
      console.log("authentication failed", error);
      return { isValid: false };
    }
  };

  validateSession = async (
    request: Request,
    session: object
  ): Promise<ValidateResponse> => {
    return { valid: true };
  };
}

export default AuthUtils;
