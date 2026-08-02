"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const assets_controller_1 = require("./assets.controller");
describe('AssetsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [assets_controller_1.AssetsController],
        }).compile();
        controller = module.get(assets_controller_1.AssetsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=assets.controller.spec.js.map