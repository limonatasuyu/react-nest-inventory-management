import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from 'src/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDTO) {
    return await this.authService.login(dto);
  }

  @Post('register')
  async register(@Body() dto: RegisterDTO) {
    return await this.authService.register(dto);
  }
}
