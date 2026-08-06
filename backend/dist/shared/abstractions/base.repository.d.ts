import { PrismaService } from '../../prisma/prisma.service';
export declare abstract class BaseRepository<TDelegate extends {
    findMany: any;
    findUnique: any;
    create: any;
    update: any;
}> {
    protected readonly prisma: PrismaService;
    protected readonly delegate: TDelegate;
    constructor(prisma: PrismaService, delegate: TDelegate);
    findMany(args?: any): Promise<any>;
    findUnique(args: any): Promise<any>;
    create(args: any): Promise<any>;
    update(args: any): Promise<any>;
}
