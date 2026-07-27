import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('auth.googleClientId', 'mock-client-id'),
      clientSecret: configService.get<string>('auth.googleClientSecret', 'mock-client-secret'),
      callbackURL: configService.get<string>(
        'auth.googleCallbackUrl',
        'http://localhost:3001/api/v1/auth/google/callback',
      ),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    const { id, name, emails, photos } = profile;
    const userProfile = {
      provider: 'google',
      providerAccountId: id,
      email: emails && emails[0] ? emails[0].value.toLowerCase() : '',
      firstName: name?.givenName || 'Google',
      lastName: name?.familyName || 'User',
      avatarUrl: photos && photos[0] ? photos[0].value : undefined,
      accessToken,
      refreshToken,
    };
    done(null, userProfile);
  }
}
