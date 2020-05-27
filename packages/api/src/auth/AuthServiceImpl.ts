import UserDto from "../user/UserDto";
import { inject, injectable } from "inversify";
import {
  DEP_TYPES,
  RecordNotFoundError,
  AuthenticationError,
  InvalidCredentialsError,
} from "../shared/CustomTypes";
import UserDao from "../user/UserDao";
import { unauthorized } from "@hapi/boom";
import bcrypt from "bcrypt";
import AuthService from "./AuthService";

@injectable()
class AuthServiceImpl implements AuthService {
  private userDao: UserDao;
  constructor(@inject(DEP_TYPES.UserDao) userDao: UserDao) {
    this.userDao = userDao;
  }
  public async authenticate(email: string, password: string): Promise<UserDto> {
    try {
      const user: UserDto = await this.userDao.findByEmail(email);
      const result = await bcrypt.compare(password, String(user.password));
      if (result) {
        return UserDto.createForLoginResponse(user);
      } else {
        throw new InvalidCredentialsError(
          "Invalid Credentials",
          unauthorized("Invalid Credentials")
        );
      }
    } catch (error) {
      if (error instanceof RecordNotFoundError) {
        throw new AuthenticationError(
          "Authentication Failed",
          unauthorized("Authentication Failed")
        );
      } else throw error;
    }
  }
}

export default AuthServiceImpl;
