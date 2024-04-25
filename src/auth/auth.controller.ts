import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(loginUserDto);

    //setting refresh Token in cookies

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return result;
  }

  @Post('/logout')
  @HttpCode(HttpStatus.RESET_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    //getting refresh token
    const { refreshToken } = req.cookies;

    await this.authService.logout(refreshToken);

    res.clearCookie('refreshToken');
  }

  @Post('/registration')
  async registration(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.registration(createUserDto);

    if (!result) {
      throw new HttpException(
        'User with this email already Exists',
        HttpStatus.BAD_REQUEST
      );
    }

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,

      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return result;
  }

  @Post('/update')
  async updateAccessToken(@Req() req: Request) {
    const { refreshToken } = req.cookies;
    const token = await this.authService.registration(refreshToken);
    return token;
  }
}
