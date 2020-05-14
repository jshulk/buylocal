import { ThrowableMaybe } from "../shared/CustomTypes";
import UserDto from "./UserDto";

interface UserService {
  createUser(payload: UserDto): Promise<number>;
}
export default UserService;
