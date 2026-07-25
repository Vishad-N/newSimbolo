import { ValidationPipe as NestValidationPipe, ValidationError, HttpStatus, Injectable } from '@nestjs/common';
import { BusinessException } from '../exceptions/custom.exceptions';
import { ERROR_CODES } from '../constants/error-codes.constant';

@Injectable()
export class CustomValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = this.formatErrors(errors);
        return new BusinessException(messages.join('; '), ERROR_CODES.VALIDATION_ERROR, HttpStatus.BAD_REQUEST);
      },
    });
  }

  private formatErrors(errors: ValidationError[]): string[] {
    const result: string[] = [];
    for (const error of errors) {
      if (error.constraints) {
        result.push(...Object.values(error.constraints));
      }
      if (error.children && error.children.length > 0) {
        result.push(...this.formatErrors(error.children));
      }
    }
    return result;
  }
}
