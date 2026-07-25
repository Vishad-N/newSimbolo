import { SetMetadata } from '@nestjs/common';
import { APP_CONSTANTS } from '../constants/app.constants';
import { UserRole } from '../constants/role.constant';

export const Roles = (...roles: UserRole[]) => SetMetadata(APP_CONSTANTS.ROLES_KEY, roles);
