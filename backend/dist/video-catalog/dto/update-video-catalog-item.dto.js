"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVideoCatalogItemDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_video_catalog_item_dto_1 = require("./create-video-catalog-item.dto");
class UpdateVideoCatalogItemDto extends (0, swagger_1.PartialType)(create_video_catalog_item_dto_1.CreateVideoCatalogItemDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateVideoCatalogItemDto = UpdateVideoCatalogItemDto;
//# sourceMappingURL=update-video-catalog-item.dto.js.map