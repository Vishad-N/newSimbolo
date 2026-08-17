"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePortfolioProjectDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_portfolio_project_dto_1 = require("./create-portfolio-project.dto");
class UpdatePortfolioProjectDto extends (0, swagger_1.PartialType)(create_portfolio_project_dto_1.CreatePortfolioProjectDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdatePortfolioProjectDto = UpdatePortfolioProjectDto;
//# sourceMappingURL=update-portfolio-project.dto.js.map