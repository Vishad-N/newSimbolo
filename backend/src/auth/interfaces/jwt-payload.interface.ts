import { UserRole } from '../../common/constants/role.constant';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  iat?: number;
  exp?: number;
}
