import { Logger } from '@nestjs/common';
export declare abstract class BaseService {
    protected readonly logger: Logger;
    constructor(contextName: string);
    protected checkEntityExists<T>(entity: T | null | undefined, resourceName: string, identifier?: string): NonNullable<T>;
}
