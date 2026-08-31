import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  // Forwards ?checkout=<packageSlug> from the initiating /auth/google request
  // through Google's OAuth `state` param so the callback can recover it and
  // send the user straight to checkout instead of the bare dashboard.
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const checkout = request.query?.checkout;
    return checkout ? { state: String(checkout) } : {};
  }
}
