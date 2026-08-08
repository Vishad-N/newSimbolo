import { PartialType } from '@nestjs/swagger';
import { CreateWebsiteTeamMemberDto } from './create-website-team-member.dto';

export class UpdateWebsiteTeamMemberDto extends PartialType(CreateWebsiteTeamMemberDto) {}
