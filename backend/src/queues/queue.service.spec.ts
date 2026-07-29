import { ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';

describe('QueueService', () => {
  it('degrades cleanly when Redis is not configured', async () => {
    const configService = { get: jest.fn().mockReturnValue('') };
    const service = new QueueService(configService as unknown as ConfigService);

    await expect(service.add('email', 'send', { to: 'client@example.com' })).resolves.toEqual({
      queued: false,
      queueName: 'email',
      name: 'send',
    });
    await expect(service.getHealth()).resolves.toEqual({ status: 'disabled', queues: [] });
  });
});
