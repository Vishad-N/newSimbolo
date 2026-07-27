import { SetMetadata } from '@nestjs/common';
import { APP_CONSTANTS } from '../constants/app.constants';

export const Permissions = (...permissions: string[]) => SetMetadata(APP_CONSTANTS.PERMISSIONS_KEY, permissions);
