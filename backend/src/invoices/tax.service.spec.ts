import { Test, TestingModule } from '@nestjs/testing';
import { TaxService } from './tax.service';

describe('TaxService', () => {
  let service: TaxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxService],
    }).compile();

    service = module.get<TaxService>(TaxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate IGST for inter-state transactions', () => {
    const result = service.calculateTax({
      supplierStateCode: '23',
      customerStateCode: '27',
      items: [
        {
          description: 'Web Design',
          quantity: 1,
          unitPrice: 10000,
          gstRate: 18,
        },
      ],
    });

    expect(result.isInterState).toBe(true);
    expect(result.subtotal).toBe(10000);
    expect(result.totalIgst).toBe(1800);
    expect(result.totalCgst).toBe(0);
    expect(result.totalSgst).toBe(0);
    expect(result.totalTax).toBe(1800);
    expect(result.totalAmount).toBe(11800);
  });

  it('should calculate CGST and SGST for intra-state transactions', () => {
    const result = service.calculateTax({
      supplierStateCode: '23',
      customerStateCode: '23',
      items: [
        {
          description: 'SEO Services',
          quantity: 2,
          unitPrice: 5000,
          gstRate: 18,
        },
      ],
    });

    expect(result.isInterState).toBe(false);
    expect(result.subtotal).toBe(10000);
    expect(result.totalIgst).toBe(0);
    expect(result.totalCgst).toBe(900);
    expect(result.totalSgst).toBe(900);
    expect(result.totalTax).toBe(1800);
    expect(result.totalAmount).toBe(11800);
  });

  it('should fallback to intra-state if customer state code is not provided', () => {
    const result = service.calculateTax({
      supplierStateCode: '23',
      items: [
        {
          description: 'Consultation',
          quantity: 1,
          unitPrice: 2000,
          gstRate: 18,
        },
      ],
    });

    expect(result.isInterState).toBe(false);
    expect(result.totalIgst).toBe(0);
    expect(result.totalCgst).toBe(180);
    expect(result.totalSgst).toBe(180);
  });
});
