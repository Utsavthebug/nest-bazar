import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {}

  async login(userDto: LoginUserDto) {
    const user = await this.validateUser(userDto);

    return this.tokenService.generateToken(user.id);
  }

  async registration(createUserDto: CreateUserDto) {
    //find candidate
    const candidateUser = await this.userService.findOnebyEmail(
      createUserDto.email
    );

    if (!candidateUser) {
      return null;
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 7);

    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword
    });

    return this.tokenService.generateToken(user.id);
  }

  async logout(refreshToken: string) {
    const { id } = await this.tokenService.isRefreshTokenValid(refreshToken);
    return this.tokenService.removeRefreshToken(id);
  }

  async updateAccessToken(refreshToken: string) {
    const id = await this.tokenService.isRefreshTokenValid(refreshToken);
    const { accessToken } = await this.tokenService.generateToken(id);
    return accessToken;
  }

  private async validateUser(userDto: LoginUserDto) {
    //check if user is present
    const user = await this.userService.findOnebyEmail(userDto.email);

    if (!user) {
      throw new NotFoundException(
        `There is no user under this email ${userDto.email}`
      );
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password
    );

    if (passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({ message: 'Incorrect Password' });
  }
}
