import { Body, Controller, Post, Response } from '@nestjs/common';
import { Response as Res } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from 'src/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDTO, @Response() res: Res) {
    const result = await this.authService.login(dto);
    const currentDate = new Date();
    const oneDayAfter = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    res.set(
      'Set-Cookie',
      'access_token=' +
        result.access_token +
        '; Expires=' +
        oneDayAfter.toUTCString() +
        '; Path=/',
    );
    res.set('Access-Control-Allow-Origin', 'https://limonatasuyu.github.io');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Headers', 'POST, PUT, GET, OPTIONS, DELETE');
    res.send({ message: result.message });
  }

  @Post('register')
  async register(@Body() dto: RegisterDTO) {
    return await this.authService.register(dto);
  }
}
