"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPaginatedResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const paginated_response_dto_1 = require("../dto/paginated-response.dto");
const ApiPaginatedResponse = (model) => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(paginated_response_dto_1.PaginatedResponseDto, model), (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved paginated items',
        schema: {
            allOf: [
                {
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Operation successful' },
                        data: {
                            type: 'object',
                            properties: {
                                items: {
                                    type: 'array',
                                    items: { $ref: (0, swagger_1.getSchemaPath)(model) },
                                },
                                meta: {
                                    type: 'object',
                                    properties: {
                                        page: { type: 'number', example: 1 },
                                        limit: { type: 'number', example: 10 },
                                        totalItems: { type: 'number', example: 100 },
                                        totalPages: { type: 'number', example: 10 },
                                        hasNextPage: { type: 'boolean', example: true },
                                        hasPreviousPage: { type: 'boolean', example: false },
                                    },
                                },
                            },
                        },
                    },
                },
            ],
        },
    }));
};
exports.ApiPaginatedResponse = ApiPaginatedResponse;
//# sourceMappingURL=api-paginated-response.decorator.js.map