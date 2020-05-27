import UserDto from "../user/UserDto";

interface AuthService {
  authenticate(email: string, password: string): Promise<UserDto>;
}
export default AuthService;
