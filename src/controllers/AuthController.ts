
import { AuthService } from '../services/AuthService';
import type { LoginDto } from '../models/dto/auth.types';

export class AuthController {
  static async login(username: string, password: string) {
    const credentials: LoginDto = { username, password } as LoginDto;
    return AuthService.login(credentials);
  }
}


