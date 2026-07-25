import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { APP_CONSTANTS } from '../constants/app.constants';
import { UserRole } from '../constants/role.constant';
import { CustomForbiddenException } from '../exceptions/custom.exceptions';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(APP_CONSTANTS.ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new CustomForbiddenException('No assigned role found for current user');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new CustomForbiddenException(`Required role(s): ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
