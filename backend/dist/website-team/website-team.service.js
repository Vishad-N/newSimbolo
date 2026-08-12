"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteTeamService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WebsiteTeamService = class WebsiteTeamService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto) {
        const data = {
            name: createDto.name,
            designation: createDto.designation,
            bio: createDto.bio,
            image: createDto.image,
            displayOrder: createDto.displayOrder,
            isActive: createDto.isActive,
        };
        if (createDto.socialLinks) {
            data.socialLinks = createDto.socialLinks;
        }
        return this.prisma.websiteTeamMember.create({ data });
    }
    async findAll(activeOnly = false) {
        return this.prisma.websiteTeamMember.findMany({
            where: activeOnly ? { isActive: true } : undefined,
            orderBy: { displayOrder: 'asc' },
        });
    }
    async findOne(id) {
        const member = await this.prisma.websiteTeamMember.findUnique({
            where: { id },
        });
        if (!member) {
            throw new common_1.NotFoundException(`WebsiteTeamMember with ID ${id} not found`);
        }
        return member;
    }
    async update(id, updateDto) {
        const data = {
            name: updateDto.name,
            designation: updateDto.designation,
            bio: updateDto.bio,
            image: updateDto.image,
            displayOrder: updateDto.displayOrder,
            isActive: updateDto.isActive,
        };
        if (updateDto.socialLinks !== undefined) {
            data.socialLinks = updateDto.socialLinks;
        }
        try {
            return await this.prisma.websiteTeamMember.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`WebsiteTeamMember with ID ${id} not found`);
        }
    }
    async remove(id) {
        try {
            return await this.prisma.websiteTeamMember.delete({
                where: { id },
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`WebsiteTeamMember with ID ${id} not found`);
        }
    }
    async reorder(updates) {
        const transaction = updates.map((update) => this.prisma.websiteTeamMember.update({
            where: { id: update.id },
            data: { displayOrder: update.displayOrder },
        }));
        return this.prisma.$transaction(transaction);
    }
};
exports.WebsiteTeamService = WebsiteTeamService;
exports.WebsiteTeamService = WebsiteTeamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebsiteTeamService);
//# sourceMappingURL=website-team.service.js.map