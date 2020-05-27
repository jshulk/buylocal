import { ThrowableMaybe } from "../shared/CustomTypes";
import UserDto from "./UserDto";
import UserDtoInterface from "./UserDtoInterface";

interface UserService {
  createUser(payload: UserDto): Promise<number>;
  find(query?: any): Promise<UserDto>;
  findAll(query?: any): Promise<Array<UserDto>>;
  update(id: number, payload: UserDtoInterface): Promise<UserDto>;
  delete(id: number): Promise<number>;
}
export default UserService;
