import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configservice: ConfigService) => ({
        secret: configservice.get('jwt').secret
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
