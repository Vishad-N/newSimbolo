import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from '../auth/dto/register.dto';
import { CreateLeadDto } from '../leads/dto/create-lead.dto';

describe('Input validation rules', () => {
  it('rejects numbers in registration names', async () => {
    const dto = plainToInstance(RegisterDto, {
      email: 'client@example.com',
      password: 'StrongPass1',
      firstName: 'Asha1',
      lastName: 'Mehta',
      countryCode: '+91',
      phone: '9876543210',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'firstName')).toBe(true);
  });

  it('rejects lead phone numbers that are not exactly 10 digits', async () => {
    const dto = plainToInstance(CreateLeadDto, {
      firstName: 'Asha',
      lastName: 'Mehta',
      email: 'asha@example.com',
      countryCode: '+91',
      phone: '98765432101',
      message: 'Need SEO support',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'phone')).toBe(true);
  });

  it('accepts clean lead contact details', async () => {
    const dto = plainToInstance(CreateLeadDto, {
      firstName: 'Asha',
      lastName: "D'Souza",
      email: 'ASHA@EXAMPLE.COM',
      countryCode: '+91',
      phone: '9876543210',
      message: 'Need SEO support',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });
});
