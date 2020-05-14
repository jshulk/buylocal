import UserDto from "./UserDto";
import UserDao from "./UserDao";
import {
  ThrowableMaybe,
  DEP_TYPES,
  DBError,
  UserCreationException
} from "../shared/CustomTypes";
import UserService from "./UserService";
import { injectable, inject } from "inversify";
import "reflect-metadata";
@injectable()
class UserServiceImpl implements UserService {
  private userDao: UserDao;
  constructor(@inject(DEP_TYPES.UserDao) userDao: UserDao) {
    this.userDao = userDao;
  }
  createUser = async (newUser: UserDto): Promise<number> => {
    try {
      return await this.userDao.save(newUser);
    } catch (e) {
      if (e instanceof DBError) {
        throw new UserCreationException("Could not register user");
      } else throw e;
    }
  };
}

export default UserServiceImpl;
