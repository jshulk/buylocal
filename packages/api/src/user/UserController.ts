import { Request } from "@hapi/hapi";
import UserDto from "./UserDto";
import { injectable, inject } from "inversify";
import UserService from "./UserService";
import "reflect-metadata";
import {
  DEP_TYPES,
  InvalidRequestError,
  UserCreationException,
  CustomError,
} from "../shared/CustomTypes";
import { awaitWithError } from "../shared/Utils";
import { Controller, Post, Get, Put, Delete } from "../shared/decorators";
import {
  createUserSchema,
  updateUserSchema,
  updateUserPayloadSchema,
} from "./UserSchemas";

@Controller("/users")
@injectable()
class UserController {
  public userService: UserService;

  constructor(@inject(DEP_TYPES.UserService) userService: UserService) {
    this.userService = userService;
  }

  @Post("/create", { validate: { payload: createUserSchema }, auth: false })
  async create(request: Request): Promise<number | string> {
    try {
      const newUser: UserDto = UserDto.createFromRequest(
        <UserDto>request.payload
      );
      const [err, createResponse] = await awaitWithError(
        this.userService.createUser(newUser)
      );
      if (err) throw err;
      console.log("createResponse", createResponse);
      return createResponse;
    } catch (error) {
      console.log("User Controller", error.message);
      if (error instanceof UserCreationException) {
        throw error.boomInstance;
      }
      throw new CustomError(error.message).boomInstance;
    }
  }

  @Get("/{id?}")
  async get(request: Request): Promise<UserDto | Array<UserDto>> {
    try {
      return request.params.id
        ? await this.userService.find(request.params.id)
        : await this.userService.findAll({ pageSize: 10 });
    } catch (error) {
      throw error.boomInstance
        ? error.boomInstance
        : new CustomError(error.message).boomInstance;
    }
  }

  @Put("/{id}", {
    validate: { params: updateUserSchema, payload: updateUserPayloadSchema },
  })
  async update(request: Request): Promise<UserDto> {
    try {
      const userPayload: UserDto = UserDto.createFromRequest(
        <UserDto>request.payload
      );
      return await this.userService.update(
        Number(request.params.id),
        userPayload
      );
    } catch (error) {
      throw error.boomInstance
        ? error.boomInstance
        : new CustomError(error.message).boomInstance;
    }
  }

  @Delete("/{id}", { validate: { params: updateUserSchema } })
  async delete(request: Request): Promise<number> {
    try {
      return await this.userService.delete(Number(request.params.id));
    } catch (error) {
      throw error.boomInstance
        ? error.boomInstance
        : new CustomError(error.message).boomInstance;
    }
  }
}
export default UserController;
