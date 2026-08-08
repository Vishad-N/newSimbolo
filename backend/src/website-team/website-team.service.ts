import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWebsiteTeamMemberDto } from './dto/create-website-team-member.dto';
import { UpdateWebsiteTeamMemberDto } from './dto/update-website-team-member.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WebsiteTeamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateWebsiteTeamMemberDto) {
    const data: Prisma.WebsiteTeamMemberCreateInput = {
      name: createDto.name,
      designation: createDto.designation,
      bio: createDto.bio,
      image: createDto.image,
      displayOrder: createDto.displayOrder,
      isActive: createDto.isActive,
    };
    
    if (createDto.socialLinks) {
      data.socialLinks = createDto.socialLinks as Prisma.InputJsonValue;
    }

    return this.prisma.websiteTeamMember.create({ data });
  }

  async findAll(activeOnly = false) {
    return this.prisma.websiteTeamMember.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.websiteTeamMember.findUnique({
      where: { id },
    });
    if (!member) {
      throw new NotFoundException(`WebsiteTeamMember with ID ${id} not found`);
    }
    return member;
  }

  async update(id: string, updateDto: UpdateWebsiteTeamMemberDto) {
    const data: Prisma.WebsiteTeamMemberUpdateInput = {
      name: updateDto.name,
      designation: updateDto.designation,
      bio: updateDto.bio,
      image: updateDto.image,
      displayOrder: updateDto.displayOrder,
      isActive: updateDto.isActive,
    };

    if (updateDto.socialLinks !== undefined) {
      data.socialLinks = updateDto.socialLinks as Prisma.InputJsonValue;
    }

    try {
      return await this.prisma.websiteTeamMember.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`WebsiteTeamMember with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.websiteTeamMember.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`WebsiteTeamMember with ID ${id} not found`);
    }
  }

  async reorder(updates: { id: string; displayOrder: number }[]) {
    const transaction = updates.map((update) =>
      this.prisma.websiteTeamMember.update({
        where: { id: update.id },
        data: { displayOrder: update.displayOrder },
      }),
    );
    return this.prisma.$transaction(transaction);
  }
}
