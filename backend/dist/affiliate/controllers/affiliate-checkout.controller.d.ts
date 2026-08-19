import { ValidateEmployeeCodeDto } from '../dto/validate-employee-code.dto';
import { AffiliateService } from '../services/affiliate.service';
export declare class AffiliateCheckoutController {
    private readonly affiliateService;
    constructor(affiliateService: AffiliateService);
    /**
     * UX-only pre-validation of an employee code.
     *
     * This endpoint is NOT the security boundary — /payments/create-order re-runs the
     * exact same validation server-side and refuses to create a gateway order for an
     * invalid code. A client that skips or fakes this call gains nothing.
     */
    validate(dto: ValidateEmployeeCodeDto, user: any): Promise<{
        valid: boolean;
        message: string;
        employee?: undefined;
    } | {
        valid: boolean;
        employee: {
            code: string;
            name: string | undefined;
        };
        message?: undefined;
    }>;
}
