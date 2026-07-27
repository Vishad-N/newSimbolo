import { PrismaClient, RoleTypeEnum, UserStatusEnum } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Phase 5: Authentication & Authorization...');

  // 1. Seed Permissions
  const permissionsData = [
    // Users module
    { name: 'View Users', slug: 'users.view', module: 'users', description: 'Can view user profiles and lists' },
    { name: 'Manage Users', slug: 'users.manage', module: 'users', description: 'Can update user profiles and statuses' },
    { name: 'Delete Users', slug: 'users.delete', module: 'users', description: 'Can delete or suspend users' },
    // Roles & Permissions module
    { name: 'View Roles', slug: 'roles.view', module: 'roles', description: 'Can view security roles' },
    { name: 'Manage Roles', slug: 'roles.manage', module: 'roles', description: 'Can create and modify security roles' },
    { name: 'View Permissions', slug: 'permissions.view', module: 'permissions', description: 'Can view permissions' },
    { name: 'Manage Permissions', slug: 'permissions.manage', module: 'permissions', description: 'Can assign permissions to roles' },
    // Services module
    { name: 'View Services', slug: 'services.view', module: 'services', description: 'Can view service offerings' },
    { name: 'Create Services', slug: 'services.create', module: 'services', description: 'Can create new services' },
    { name: 'Update Services', slug: 'services.update', module: 'services', description: 'Can edit existing services' },
    { name: 'Delete Services', slug: 'services.delete', module: 'services', description: 'Can remove services' },
    // Packages module
    { name: 'View Packages', slug: 'packages.view', module: 'packages', description: 'Can view package pricing and tiers' },
    { name: 'Create Packages', slug: 'packages.create', module: 'packages', description: 'Can create packages' },
    { name: 'Update Packages', slug: 'packages.update', module: 'packages', description: 'Can update packages' },
    { name: 'Delete Packages', slug: 'packages.delete', module: 'packages', description: 'Can delete packages' },
    // Blogs module
    { name: 'View Blogs', slug: 'blogs.view', module: 'blogs', description: 'Can view blog articles' },
    { name: 'Create Blogs', slug: 'blogs.create', module: 'blogs', description: 'Can draft new blog articles' },
    { name: 'Edit Blogs', slug: 'blogs.edit', module: 'blogs', description: 'Can edit blog articles' },
    { name: 'Publish Blogs', slug: 'blogs.publish', module: 'blogs', description: 'Can publish or archive blog articles' },
    { name: 'Delete Blogs', slug: 'blogs.delete', module: 'blogs', description: 'Can delete blog articles' },
    // Case Studies module
    { name: 'View Case Studies', slug: 'caseStudies.view', module: 'caseStudies', description: 'Can view case studies' },
    { name: 'Create Case Studies', slug: 'caseStudies.create', module: 'caseStudies', description: 'Can create case studies' },
    { name: 'Edit Case Studies', slug: 'caseStudies.edit', module: 'caseStudies', description: 'Can edit case studies' },
    { name: 'Publish Case Studies', slug: 'caseStudies.publish', module: 'caseStudies', description: 'Can publish case studies' },
    { name: 'Delete Case Studies', slug: 'caseStudies.delete', module: 'caseStudies', description: 'Can delete case studies' },
    // Orders module
    { name: 'View Orders', slug: 'orders.view', module: 'orders', description: 'Can view customer orders' },
    { name: 'Manage Orders', slug: 'orders.manage', module: 'orders', description: 'Can process and update order status' },
    { name: 'Create Orders', slug: 'orders.create', module: 'orders', description: 'Can create new orders' },
    // Payments module
    { name: 'View Payments', slug: 'payments.view', module: 'payments', description: 'Can view payment transactions' },
    { name: 'Manage Payments', slug: 'payments.manage', module: 'payments', description: 'Can process or verify payments' },
    { name: 'Refund Payments', slug: 'payments.refund', module: 'payments', description: 'Can issue refunds' },
    // Media module
    { name: 'View Media', slug: 'media.view', module: 'media', description: 'Can view uploaded media assets' },
    { name: 'Upload Media', slug: 'media.upload', module: 'media', description: 'Can upload new files and media' },
    { name: 'Delete Media', slug: 'media.delete', module: 'media', description: 'Can delete media assets' },
    // Analytics & Settings
    { name: 'View Analytics', slug: 'analytics.view', module: 'analytics', description: 'Can view platform analytics and KPIs' },
    { name: 'Export Reports', slug: 'reports.export', module: 'analytics', description: 'Can export data reports' },
    { name: 'View Settings', slug: 'settings.view', module: 'settings', description: 'Can view platform configuration' },
    { name: 'Manage Settings', slug: 'settings.manage', module: 'settings', description: 'Can change system configuration' },
  ];

  console.log(`Creating/updating ${permissionsData.length} permissions...`);
  const createdPermissions: Record<string, string> = {};

  for (const perm of permissionsData) {
    const record = await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: { name: perm.name, description: perm.description, module: perm.module },
      create: perm,
    });
    createdPermissions[perm.slug] = record.id;
  }

  // 2. Seed Roles
  const rolesData = [
    { name: 'Super Admin', slug: 'SUPER_ADMIN', description: 'System root administrator with complete access', type: RoleTypeEnum.SYSTEM },
    { name: 'Admin', slug: 'ADMIN', description: 'Platform administrator with management access', type: RoleTypeEnum.SYSTEM },
    { name: 'Content Manager', slug: 'CONTENT_MANAGER', description: 'Manages blogs, case studies, FAQs, and media', type: RoleTypeEnum.SYSTEM },
    { name: 'Project Manager', slug: 'PROJECT_MANAGER', description: 'Manages client projects, orders, and timelines', type: RoleTypeEnum.SYSTEM },
    { name: 'Marketing Manager', slug: 'MARKETING_MANAGER', description: 'Manages SEO, marketing campaigns, and analytics', type: RoleTypeEnum.SYSTEM },
    { name: 'Support Agent', slug: 'SUPPORT', description: 'Handles client support tickets and inquiries', type: RoleTypeEnum.SYSTEM },
    { name: 'Client', slug: 'CLIENT', description: 'Standard client user purchasing services and viewing projects', type: RoleTypeEnum.SYSTEM },
    { name: 'Affiliate', slug: 'AFFILIATE', description: 'Affiliate partner referring new clients', type: RoleTypeEnum.SYSTEM },
    { name: 'Editor', slug: 'EDITOR', description: 'Content writer and draft editor', type: RoleTypeEnum.SYSTEM },
  ];

  console.log(`Creating/updating ${rolesData.length} roles...`);
  const createdRoles: Record<string, string> = {};

  for (const role of rolesData) {
    const record = await prisma.role.upsert({
      where: { slug: role.slug },
      update: { name: role.name, description: role.description, type: role.type },
      create: role,
    });
    createdRoles[role.slug] = record.id;
  }

  // 3. Assign Permissions to Roles
  console.log('Assigning permission bundles to roles...');
  
  // Super Admin gets ALL permissions
  const allPermissionIds = Object.values(createdPermissions).map((id) => ({ id }));
  await prisma.role.update({
    where: { id: createdRoles['SUPER_ADMIN'] },
    data: { permissions: { set: allPermissionIds } },
  });

  // Admin gets all except settings.manage and roles.manage
  const adminPermSlugs = Object.keys(createdPermissions).filter(
    (slug) => !['settings.manage', 'roles.manage'].includes(slug),
  );
  await prisma.role.update({
    where: { id: createdRoles['ADMIN'] },
    data: { permissions: { set: adminPermSlugs.map((s) => ({ id: createdPermissions[s] })) } },
  });

  // Content Manager gets blog, case study, media, service view perms
  const contentPermSlugs = [
    'blogs.view', 'blogs.create', 'blogs.edit', 'blogs.publish',
    'caseStudies.view', 'caseStudies.create', 'caseStudies.edit', 'caseStudies.publish',
    'media.view', 'media.upload', 'services.view', 'packages.view',
  ];
  await prisma.role.update({
    where: { id: createdRoles['CONTENT_MANAGER'] },
    data: { permissions: { set: contentPermSlugs.map((s) => ({ id: createdPermissions[s] })) } },
  });

  // Project Manager gets order, service, user view perms
  const pmPermSlugs = [
    'orders.view', 'orders.manage', 'orders.create',
    'services.view', 'packages.view', 'users.view', 'media.view', 'media.upload',
  ];
  await prisma.role.update({
    where: { id: createdRoles['PROJECT_MANAGER'] },
    data: { permissions: { set: pmPermSlugs.map((s) => ({ id: createdPermissions[s] })) } },
  });

  // Client gets basic read/create order perms
  const clientPermSlugs = ['services.view', 'packages.view', 'orders.view', 'orders.create'];
  await prisma.role.update({
    where: { id: createdRoles['CLIENT'] },
    data: { permissions: { set: clientPermSlugs.map((s) => ({ id: createdPermissions[s] })) } },
  });

  // 4. Seed Default Super Admin User
  console.log('Seeding default Super Admin user...');
  const superAdminEmail = 'admin@simbolo.ai';
  const hashedPassword = await bcrypt.hash('Admin@123456', 12);

  await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      passwordHash: hashedPassword,
      status: UserStatusEnum.ACTIVE,
      roleId: createdRoles['SUPER_ADMIN'],
    },
    create: {
      email: superAdminEmail,
      passwordHash: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      status: UserStatusEnum.ACTIVE,
      roleId: createdRoles['SUPER_ADMIN'],
    },
  });

  console.log('✅ Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
