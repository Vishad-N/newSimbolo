"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const automation_dto_1 = require("./dto/automation.dto");
const automation_service_1 = require("./automation.service");
describe('AutomationService', () => {
    it('executes enabled rules matching a trigger', async () => {
        const rule = {
            id: 'rule-1',
            name: 'Notify client',
            trigger: automation_dto_1.AutomationTrigger.ORDER_PAID,
            enabled: true,
            actions: [
                { type: automation_dto_1.AutomationActionType.GENERATE_NOTIFICATION, config: { title: 'Paid', message: 'Payment received' } },
            ],
            createdAt: '2026-07-28T00:00:00.000Z',
            updatedAt: '2026-07-28T00:00:00.000Z',
        };
        const prisma = {
            globalSetting: { findMany: jest.fn().mockResolvedValue([{ value: JSON.stringify(rule) }]) },
            notification: { create: jest.fn().mockResolvedValue({}) },
            timeline: { create: jest.fn().mockResolvedValue({}) },
            auditLog: { create: jest.fn().mockResolvedValue({}) },
        };
        const service = new automation_service_1.AutomationService(prisma);
        const result = await service.execute({ trigger: automation_dto_1.AutomationTrigger.ORDER_PAID, payload: { userId: 'user-id' } });
        expect(result.matchedRules).toBe(1);
        expect(prisma.notification.create).toHaveBeenCalledWith({
            data: expect.objectContaining({ userId: 'user-id', title: 'Paid' }),
        });
    });
});
//# sourceMappingURL=automation.service.spec.js.map