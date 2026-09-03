import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { APP_CONSTANTS } from '../constants/app.constants';
import { CustomForbiddenException } from '../exceptions/custom.exceptions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(APP_CONSTANTS.PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new CustomForbiddenException('User authentication required for permission check');
    }

    if (user.role === 'SUPER_ADMIN') {
      return true; // Super admin has root access to all endpoints
    }

    const userPermissions: string[] = user.permissions || [];
    // @Permissions(a, b, ...) is used throughout the app as "any of these" (e.g.
    // 'orders.view' OR 'orders.manage', with services scoping visibility further
    // based on which one is actually held) — never as "all of these".
    const hasRequiredPermission = requiredPermissions.some((perm) => userPermissions.includes(perm));

    if (!hasRequiredPermission) {
      throw new CustomForbiddenException(`Required permission(s): ${requiredPermissions.join(', ')}`);
    }

    return true;
  }
}
