import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ValidateEmployeeCodeDto } from '../dto/validate-employee-code.dto';
import { AffiliateService } from '../services/affiliate.service';

@ApiTags('Affiliate Checkout')
@ApiBearerAuth('JWT-auth')
@Controller('checkout/affiliate')
export class AffiliateCheckoutController {
  constructor(private readonly affiliateService: AffiliateService) {}

  /**
   * UX-only pre-validation of an employee code.
   *
   * This endpoint is NOT the security boundary — /payments/create-order re-runs the
   * exact same validation server-side and refuses to create a gateway order for an
   * invalid code. A client that skips or fakes this call gains nothing.
   */
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate an employee code before checkout',
    description:
      'Returns whether the code is currently usable. Responses are deliberately generic so codes cannot be enumerated.',
  })
  @ApiResponse({ status: 200, description: 'Validation result' })
  async validate(@Body() dto: ValidateEmployeeCodeDto, @CurrentUser() user: any) {
    const result = await this.affiliateService.validateEmployeeCode(dto.employeeCode, user?.sub);

    if (!result.valid || !result.affiliate) {
      return { valid: false, message: result.message ?? 'Invalid or inactive employee code' };
    }

    // Only the code and an abbreviated name are exposed — never the commission rate,
    // internal ids, email, or eligibility internals.
    return {
      valid: true,
      employee: { code: result.affiliate.affiliateCode, name: result.displayName },
    };
  }
}
