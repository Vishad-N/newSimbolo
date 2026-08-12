"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWebsiteTeamMemberDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_website_team_member_dto_1 = require("./create-website-team-member.dto");
class UpdateWebsiteTeamMemberDto extends (0, swagger_1.PartialType)(create_website_team_member_dto_1.CreateWebsiteTeamMemberDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateWebsiteTeamMemberDto = UpdateWebsiteTeamMemberDto;
//# sourceMappingURL=update-website-team-member.dto.js.map