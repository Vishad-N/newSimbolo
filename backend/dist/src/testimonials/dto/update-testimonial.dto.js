"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTestimonialDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_testimonial_dto_1 = require("./create-testimonial.dto");
class UpdateTestimonialDto extends (0, swagger_1.PartialType)(create_testimonial_dto_1.CreateTestimonialDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateTestimonialDto = UpdateTestimonialDto;
//# sourceMappingURL=update-testimonial.dto.js.map