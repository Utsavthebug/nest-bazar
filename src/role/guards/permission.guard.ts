import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { UserService } from 'src/users/users.service';
import { RoleService } from '../role.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const neededPermission = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!neededPermission) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const id = req['user'];

    try {
      const { role } = await this.userService.findOne(id);
      const hasPermission = await this.roleService.checkPermission(
        role.id,
        neededPermission
      );
      return hasPermission;
    } catch (error) {}
  }
}
