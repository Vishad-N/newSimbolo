import { PrismaService } from '../prisma/prisma.service';
import { AutomationActionType, AutomationTrigger } from './dto/automation.dto';
import { AutomationService } from './automation.service';

describe('AutomationService', () => {
  it('executes enabled rules matching a trigger', async () => {
    const rule = {
      id: 'rule-1',
      name: 'Notify client',
      trigger: AutomationTrigger.ORDER_PAID,
      enabled: true,
      actions: [
        { type: AutomationActionType.GENERATE_NOTIFICATION, config: { title: 'Paid', message: 'Payment received' } },
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
    const service = new AutomationService(prisma as unknown as PrismaService);

    const result = await service.execute({ trigger: AutomationTrigger.ORDER_PAID, payload: { userId: 'user-id' } });

    expect(result.matchedRules).toBe(1);
    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: 'user-id', title: 'Paid' }),
    });
  });
});
