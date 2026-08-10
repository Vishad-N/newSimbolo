import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  try {
    const role = await prisma.role.findUnique({ where: { slug: 'CLIENT' } });
    console.log('CLIENT role:', role);
    const count = await prisma.user.count();
    console.log('User count:', count);
    const email = 'test' + Date.now() + '@google.com';
    const user = await prisma.user.create({
      data: {
        email: email,
        firstName: 'Test',
        lastName: 'User',
        status: 'ACTIVE',
        roleId: role!.id,
      },
      include: { 
        role: { include: { permissions: true } },
        clientProfile: {
          include: {
            subscriptions: { where: { status: { in: ['ACTIVE', 'TRIALING'] } } },
            orders: { where: { status: { in: ['CONFIRMED', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED'] } } }
          }
        }
      },
    });
    console.log('Created user successfully:', user.id);
  } catch (err) {
    console.error('ERROR OCCURRED:', err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
