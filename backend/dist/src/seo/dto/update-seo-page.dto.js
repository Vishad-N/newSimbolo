"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSeoPageDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_seo_page_dto_1 = require("./create-seo-page.dto");
class UpdateSeoPageDto extends (0, swagger_1.PartialType)(create_seo_page_dto_1.CreateSeoPageDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateSeoPageDto = UpdateSeoPageDto;
//# sourceMappingURL=update-seo-page.dto.js.map