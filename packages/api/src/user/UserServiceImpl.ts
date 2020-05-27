import UserDto from "./UserDto";
import UserDao from "./UserDao";
import {
  Boom,
  forbidden,
  badGateway,
  notFound,
  badImplementation,
  boomify,
  unauthorized,
} from "@hapi/boom";
import {
  ThrowableMaybe,
  DEP_TYPES,
  DBError,
  UserCreationException,
  UserFetchException,
  DuplicateRecordError,
  RecordNotFoundError,
  UserDeleteException,
  CustomError,
  InvalidCredentialsError,
  AuthenticationError,
} from "../shared/CustomTypes";
import UserService from "./UserService";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import UserDtoInterface from "./UserDtoInterface";
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
      console.log("userservice catch");
      if (e instanceof DBError) {
        throw new UserCreationException(
          "Could not register user",
          badGateway()
        );
      } else if (e instanceof DuplicateRecordError) {
        throw new UserCreationException(
          "Email already registered",
          forbidden("Email already registered")
        );
      } else throw e;
    }
  };

  findAll = async (query: any): Promise<Array<UserDto>> => {
    try {
      return await this.userDao.findAll(query);
    } catch (error) {
      if (error instanceof DBError) {
        throw new UserFetchException("Could not fetch users", badGateway());
      } else throw error;
    }
  };

  find = async (query: any): Promise<UserDto> => {
    try {
      return await this.userDao.find(query);
    } catch (error) {
      if (error instanceof DBError) {
        throw new UserFetchException(
          "Could not find user",
          badGateway("Could not find user")
        );
      } else if (error instanceof RecordNotFoundError) {
        console.log("userNotFound");
        throw new UserFetchException(
          "User not found",
          notFound("User not found")
        );
      } else throw error;
    }
  };

  update = async (id: number, payload: UserDto): Promise<UserDto> => {
    try {
      return await this.userDao.update(id, payload);
    } catch (error) {
      if (error instanceof DBError) {
        throw new UserFetchException(
          "Could not update user",
          badGateway("Could not update user")
        );
      } else if (error instanceof RecordNotFoundError) {
        throw new UserFetchException(
          "User not found",
          notFound("User not found")
        );
      } else throw error;
    }
  };

  delete = async (id: number): Promise<number> => {
    try {
      return await this.userDao.delete(id);
    } catch (error) {
      if (error instanceof DBError) {
        throw new UserDeleteException(
          "Could not delete user",
          badImplementation("Could not delete user")
        );
      } else if (error instanceof RecordNotFoundError) {
        throw new UserFetchException(
          "User not found",
          notFound("User not found")
        );
      } else throw error;
    }
  };
}

export default UserServiceImpl;
