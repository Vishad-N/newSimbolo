import 'reflect-metadata';
import { validate } from './env.validation';

validate({
  ...process.env,
  NODE_ENV: 'production',
});

console.log('Production environment validation passed.');
