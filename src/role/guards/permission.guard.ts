import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    return new Promise(async (resolve) => {
      const neededPermission = this.reflector.getAllAndOverride<string[]>(
        PERMISSION_KEY,
        [context.getHandler(), context.getClass()]
      );
      if (!neededPermission) {
        return true;
      }

      const { user } = context.switchToHttp().getRequest();
      return neededPermission.some((role) => user.roles?.includes(role));
    });
  }
}
