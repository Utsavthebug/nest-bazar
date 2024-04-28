import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../../utility/decorators/permission.decorator';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
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
    const { role } = req.currentUser;

    try {
      const hasPermission = await this.roleService.checkPermission(
        role.id,
        neededPermission
      );
      return hasPermission;
    } catch (error) {}
  }
}
