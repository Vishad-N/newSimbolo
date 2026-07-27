import { Logger } from '@nestjs/common';
import { ResourceNotFoundException } from '../../common/exceptions/custom.exceptions';

export abstract class BaseService {
  protected readonly logger: Logger;

  constructor(contextName: string) {
    this.logger = new Logger(contextName);
  }

  protected checkEntityExists<T>(
    entity: T | null | undefined,
    resourceName: string,
    identifier?: string,
  ): NonNullable<T> {
    if (!entity) {
      this.logger.warn(`${resourceName} with identifier "${identifier || 'unknown'}" not found`);
      throw new ResourceNotFoundException(resourceName, identifier);
    }
    return entity as NonNullable<T>;
  }
}
