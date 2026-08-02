"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const assets_service_1 = require("./assets.service");
describe('AssetsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [assets_service_1.AssetsService],
        }).compile();
        service = module.get(assets_service_1.AssetsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=assets.service.spec.js.map