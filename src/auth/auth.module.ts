import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from 'src/token/token.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TokenModule, UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
