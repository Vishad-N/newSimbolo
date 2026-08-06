"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCaseStudyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_case_study_dto_1 = require("./create-case-study.dto");
class UpdateCaseStudyDto extends (0, swagger_1.PartialType)(create_case_study_dto_1.CreateCaseStudyDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateCaseStudyDto = UpdateCaseStudyDto;
//# sourceMappingURL=update-case-study.dto.js.map