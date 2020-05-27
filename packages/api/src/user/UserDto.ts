import UserDtoInterface from "./UserDtoInterface";
import { Request } from "@hapi/hapi";
import * as stream from "stream";
import { InvalidRequestError, CustomError } from "../shared/CustomTypes";

class UserDto implements UserDtoInterface {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;

  constructor(props: UserDtoInterface) {
    this.id = props.id;
    this.email = props.email;
    this.first_name = props.first_name;
    this.last_name = props.last_name;
    this.password = props.password;
  }
  static createFromRequest(payload: UserDtoInterface): UserDto | never {
    console.log("request payload", payload);
    try {
      return new UserDto(payload);
    } catch (error) {
      throw new InvalidRequestError("Invalid Request");
    }
  }

  static createForView(payload: UserDtoInterface): UserDto | never {
    try {
      return new UserDto({
        id: payload.id,
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
      });
    } catch (error) {
      throw new CustomError("Invalid user object");
    }
  }

  static createForLoginResponse(payload: UserDtoInterface): UserDto {
    console.log("payload", payload);
    try {
      return new UserDto({
        id: payload.id,
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
      });
    } catch (error) {
      throw new CustomError("Invalid user object");
    }
  }
  public toPlainObject() {
    return {
      id: this.id,
      email: this.email,
      first_name: this.first_name,
      last_name: this.last_name,
    };
  }
}
export default UserDto;
