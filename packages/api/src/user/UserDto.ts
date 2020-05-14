import UserDtoInterface from "./UserDtoInterface";
import { Request } from "@hapi/hapi";
import * as stream from "stream";
import { InvalidRequestError } from "../shared/CustomTypes";

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
}
export default UserDto;
