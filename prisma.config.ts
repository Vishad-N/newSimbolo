import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'backend/prisma/schema.prisma',
  migrations: {
    path: 'backend/prisma/migrations',
    seed: 'ts-node backend/prisma/seed.ts',
  },
});
