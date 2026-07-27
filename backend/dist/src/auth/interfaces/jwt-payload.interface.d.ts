import { UserRole } from '../../common/constants/role.constant';
export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole | string;
    permissions?: string[];
    organizationId?: string;
    iat?: number;
    exp?: number;
}
