import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO, RegisterDTO } from 'src/dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDTO) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new BadRequestException('Email or password is incorrect.');

    const { password, _id, email } = user;

    const isPasswordsMatch = await compare(dto.password, password);

    if (!isPasswordsMatch) {
      throw new UnauthorizedException('Email or password is incorrect.');
    }
    const payload = { sub: _id, email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      message: 'Login successfull.',
    };
  }

  async register(dto: RegisterDTO) {
    if (dto.email !== dto.emailAgain)
      throw new BadRequestException('Emails does not match.');
    if (dto.password !== dto.passwordAgain)
      throw new BadRequestException('Passwords does not match.');

    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!dto.email.match(emailRegex))
      throw new BadRequestException('Email is not valid.');
    if (dto.password.length < 6 || dto.password.length > 20)
      throw new BadRequestException(
        "Password can't be shorter then 6 or longer then 20 characters",
      );

    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) throw new BadRequestException('Email is already in use.');

    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(dto.password, saltRounds);

    const createdUser = await this.userService.create({
      firstname: dto.firstname,
      lastname: dto.lastname,
      email: dto.email,
      password: encryptedPassword,
    });

    if (!createdUser) throw new InternalServerErrorException();

    return { message: 'Register is succesfull.' };
  }
}
