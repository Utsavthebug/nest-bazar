import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { TokenService } from 'src/token/token.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UserService,
    private readonly tokenService: TokenService
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      req.currentUser = null;
      next();
      return;
    } else {
      try {
        const token = authHeader.split(' ')[1];
        const { id } = this.tokenService.verifyAccessToken(token);
        const currentUser = await this.usersService.findOne(id);
        req.currentUser = currentUser;
        next();
      } catch (err) {
        req.currentUser = null;
        next();
      }
    }
  }
}
