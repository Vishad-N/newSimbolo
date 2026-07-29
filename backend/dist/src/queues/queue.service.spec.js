"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queue_service_1 = require("./queue.service");
describe('QueueService', () => {
    it('degrades cleanly when Redis is not configured', async () => {
        const configService = { get: jest.fn().mockReturnValue('') };
        const service = new queue_service_1.QueueService(configService);
        await expect(service.add('email', 'send', { to: 'client@example.com' })).resolves.toEqual({
            queued: false,
            queueName: 'email',
            name: 'send',
        });
        await expect(service.getHealth()).resolves.toEqual({ status: 'disabled', queues: [] });
    });
});
//# sourceMappingURL=queue.service.spec.js.map