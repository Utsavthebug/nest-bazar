import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async setRefreshToken(id: string, refreshToken: string) {
    //getting user
    const user = await this.userService.findOne(id);

    await this.userRepository.save({
      ...user,
      refreshToken
    });
  }

  async getRefreshToken(id: string) {
    const user = await this.userService.findOne(id);

    const refreshToken = user.refreshToken;
    return refreshToken;
  }

  async removeRefreshToken(id: string) {
    //getting user from repo
    const user = await this.userService.findOne(id);

    return await this.userRepository.save({
      ...user,
      refreshToken: null
    });
  }

  verifyAccessToken(accessToken: string) {
    const decodedId = this.jwtService.verify(accessToken, {
      secret: this.configService.get('jwt').JWT_ACCESS_SECRET
    });
    return decodedId;
  }

  verifyRefreshToken(refreshToken: string) {
    const decodedId = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('jwt').JWT_REFRESH_SECRET
    });

    return decodedId;
  }

  async generateToken(id: string) {
    const payload = { id };

    //generate access token
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt').JWT_ACCESS_SECRET,
      expiresIn: this.configService.get('jwt').JWT_ACCESS_EXPIRY_TIME
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt').JWT_REFRESH_SECRET,
      expiresIn: this.configService.get('jwt').JWT_REFRESH_EXPIRY_TIME
    });

    return {
      accessToken,
      refreshToken
    };
  }

  async isRefreshTokenValid(refreshToken: string) {
    //get user from repository
    const { id } = this.verifyRefreshToken(refreshToken);
    const storedToken = await this.getRefreshToken(id);

    if (refreshToken === storedToken) {
      return id;
    }
  }
}
