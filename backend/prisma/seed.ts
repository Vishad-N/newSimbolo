import 'dotenv/config';
import { PrismaClient, RoleTypeEnum, UserStatusEnum } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface SeedAdminCredentials {
  email: string;
  password: string;
}

export const getSeedAdminCredentials = (environment: NodeJS.ProcessEnv): SeedAdminCredentials | null => {
  const email = environment.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = environment.SEED_ADMIN_PASSWORD;

  if (!email && !password) {
    return null;
  }

  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be provided together.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('SEED_ADMIN_EMAIL must be a valid email address.');
  }

  const isStrongPassword =
    password.length >= 12 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  if (!isStrongPassword) {
    throw new Error(
      'SEED_ADMIN_PASSWORD must contain at least 12 characters, including uppercase, lowercase, number, and special character.',
    );
  }

  return { email, password };
};

async function main() {
  const superAdminCredentials = getSeedAdminCredentials(process.env);
  console.log('🌱 Starting database seed for Phase 5: Authentication & Authorization...');

  // 1. Seed Permissions
  const permissionsData = [
    // Users module
    { name: 'View Users', slug: 'users.view', module: 'users', description: 'Can view user profiles and lists' },
    {
      name: 'Manage Users',
      slug: 'users.manage',
      module: 'users',
      description: 'Can update user profiles and statuses',
    },
    { name: 'Delete Users', slug: 'users.delete', module: 'users', description: 'Can delete or suspend users' },
    // Roles & Permissions module
    { name: 'View Roles', slug: 'roles.view', module: 'roles', description: 'Can view security roles' },
    {
      name: 'Manage Roles',
      slug: 'roles.manage',
      module: 'roles',
      description: 'Can create and modify security roles',
    },
    { name: 'View Permissions', slug: 'permissions.view', module: 'permissions', description: 'Can view permissions' },
    {
      name: 'Manage Permissions',
      slug: 'permissions.manage',
      module: 'permissions',
      description: 'Can assign permissions to roles',
    },
    // Services module
    { name: 'View Services', slug: 'services.view', module: 'services', description: 'Can view service offerings' },
    { name: 'Create Services', slug: 'services.create', module: 'services', description: 'Can create new services' },
    { name: 'Update Services', slug: 'services.update', module: 'services', description: 'Can edit existing services' },
    { name: 'Delete Services', slug: 'services.delete', module: 'services', description: 'Can remove services' },
    // Packages module
    {
      name: 'View Packages',
      slug: 'packages.view',
      module: 'packages',
      description: 'Can view package pricing and tiers',
    },
    { name: 'Create Packages', slug: 'packages.create', module: 'packages', description: 'Can create packages' },
    { name: 'Update Packages', slug: 'packages.update', module: 'packages', description: 'Can update packages' },
    { name: 'Delete Packages', slug: 'packages.delete', module: 'packages', description: 'Can delete packages' },
    // Blogs module
    { name: 'View Blogs', slug: 'blogs.view', module: 'blogs', description: 'Can view blog articles' },
    { name: 'Create Blogs', slug: 'blogs.create', module: 'blogs', description: 'Can draft new blog articles' },
    { name: 'Edit Blogs', slug: 'blogs.edit', module: 'blogs', description: 'Can edit blog articles' },
    {
      name: 'Publish Blogs',
      slug: 'blogs.publish',
      module: 'blogs',
      description: 'Can publish or archive blog articles',
    },
    { name: 'Delete Blogs', slug: 'blogs.delete', module: 'blogs', description: 'Can delete blog articles' },
    // Case Studies module
    {
      name: 'View Case Studies',
      slug: 'caseStudies.view',
      module: 'caseStudies',
      description: 'Can view case studies',
    },
    {
      name: 'Create Case Studies',
      slug: 'caseStudies.create',
      module: 'caseStudies',
      description: 'Can create case studies',
    },
    {
      name: 'Edit Case Studies',
      slug: 'caseStudies.edit',
      module: 'caseStudies',
      description: 'Can edit case studies',
    },
    {
      name: 'Publish Case Studies',
      slug: 'caseStudies.publish',
      module: 'caseStudies',
      description: 'Can publish case studies',
    },
    {
      name: 'Delete Case Studies',
      slug: 'caseStudies.delete',
      module: 'caseStudies',
      description: 'Can delete case studies',
    },
    // Orders module
    { name: 'View Orders', slug: 'orders.view', module: 'orders', description: 'Can view customer orders' },
    {
      name: 'Manage Orders',
      slug: 'orders.manage',
      module: 'orders',
      description: 'Can process and update order status',
    },
    { name: 'Create Orders', slug: 'orders.create', module: 'orders', description: 'Can create new orders' },
    // Payments module
    { name: 'View Payments', slug: 'payments.view', module: 'payments', description: 'Can view payment transactions' },
    {
      name: 'Manage Payments',
      slug: 'payments.manage',
      module: 'payments',
      description: 'Can process or verify payments',
    },
    { name: 'Refund Payments', slug: 'payments.refund', module: 'payments', description: 'Can issue refunds' },
    // Media module
    { name: 'View Media', slug: 'media.view', module: 'media', description: 'Can view uploaded media assets' },
    { name: 'Upload Media', slug: 'media.upload', module: 'media', description: 'Can upload new files and media' },
    { name: 'Delete Media', slug: 'media.delete', module: 'media', description: 'Can delete media assets' },
    // Analytics & Settings
    {
      name: 'View Analytics',
      slug: 'analytics.view',
      module: 'analytics',
      description: 'Can view platform analytics and KPIs',
    },
    { name: 'Export Reports', slug: 'reports.export', module: 'analytics', description: 'Can export data reports' },
    {
      name: 'View Settings',
      slug: 'settings.view',
      module: 'settings',
      description: 'Can view platform configuration',
    },
    {
      name: 'Manage Settings',
      slug: 'settings.manage',
      module: 'settings',
      description: 'Can change system configuration',
    },
    // Affiliate / sales employee commission module
    {
      name: 'Manage Affiliates',
      slug: 'affiliate.manage',
      module: 'affiliate',
      description: 'Can manage sales employees, commissions, wallets and program settings',
    },
    {
      name: 'Process Payouts',
      slug: 'affiliate.payouts.process',
      module: 'affiliate',
      description: 'Can approve, process and retry sales employee commission payouts',
    },
    // Documents & contracts module
    {
      name: 'View Documents',
      slug: 'documents.read',
      module: 'documents',
      description: 'Can view and download documents and contracts',
    },
    {
      name: 'Manage Documents',
      slug: 'documents.manage',
      module: 'documents',
      description: 'Can view any client\'s documents, edit metadata, and delete documents',
    },
    {
      name: 'Upload Documents',
      slug: 'documents.upload',
      module: 'documents',
      description: 'Can upload a file and register it as a document (own client only, for non-staff)',
    },
    // Dashboard module
    {
      name: 'View Dashboard',
      slug: 'dashboard.view',
      module: 'dashboard',
      description: 'Can view dashboard overview, KPIs, and widgets',
    },
    // Clients module
    {
      name: 'View Clients',
      slug: 'clients.read',
      module: 'clients',
      description: "Can view any client's profile and dashboard (staff only)",
    },
    {
      name: 'Manage Clients',
      slug: 'clients.manage',
      module: 'clients',
      description: 'Can create, update, and delete client records',
    },
    // AI module
    { name: 'Use AI', slug: 'ai.use', module: 'ai', description: 'Can use AI-assisted content generation and search' },
    {
      name: 'Manage AI',
      slug: 'ai.manage',
      module: 'ai',
      description: 'Can manage AI conversations and trigger embedding sync',
    },
    // Audit module
    { name: 'View Audit Log', slug: 'audit.view', module: 'audit', description: 'Can view the system audit log' },
    // Automation module
    {
      name: 'Manage Automation',
      slug: 'automation.manage',
      module: 'automation',
      description: 'Can manage automation workflows',
    },
    // Blogs module (additional)
    { name: 'Manage Blogs', slug: 'blogs.manage', module: 'blogs', description: 'Full blog management access' },
    { name: 'Update Blogs', slug: 'blogs.update', module: 'blogs', description: 'Can update existing blog articles' },
    // Case Studies module (additional; controllers check these exact lowercase slugs)
    {
      name: 'Create Case Studies (Legacy)',
      slug: 'casestudies.create',
      module: 'caseStudies',
      description: 'Can create case studies',
    },
    {
      name: 'Update Case Studies (Legacy)',
      slug: 'casestudies.update',
      module: 'caseStudies',
      description: 'Can update case studies',
    },
    {
      name: 'Delete Case Studies (Legacy)',
      slug: 'casestudies.delete',
      module: 'caseStudies',
      description: 'Can delete case studies',
    },
    {
      name: 'Manage Case Studies (Legacy)',
      slug: 'casestudies.manage',
      module: 'caseStudies',
      description: 'Full case study management access, including metrics and categories',
    },
    // Generic CMS content module (about-us, footer, help-center, homepage, navigation, website-team)
    { name: 'Create Content', slug: 'content.create', module: 'content', description: 'Can create CMS content blocks' },
    { name: 'Read Content', slug: 'content.read', module: 'content', description: 'Can view CMS content blocks' },
    { name: 'Update Content', slug: 'content.update', module: 'content', description: 'Can edit CMS content blocks' },
    { name: 'Delete Content', slug: 'content.delete', module: 'content', description: 'Can delete CMS content blocks' },
    // Deliverables module
    {
      name: 'Read Deliverables',
      slug: 'deliverables.read',
      module: 'deliverables',
      description: 'Can view project deliverables',
    },
    {
      name: 'Upload Deliverables',
      slug: 'deliverables.upload',
      module: 'deliverables',
      description: 'Can upload new deliverable files',
    },
    {
      name: 'Approve Deliverables',
      slug: 'deliverables.approve',
      module: 'deliverables',
      description: 'Can approve or reject submitted deliverables',
    },
    // FAQs module
    { name: 'Create FAQs', slug: 'faqs.create', module: 'faqs', description: 'Can create FAQ entries' },
    { name: 'Update FAQs', slug: 'faqs.update', module: 'faqs', description: 'Can update FAQ entries' },
    { name: 'Delete FAQs', slug: 'faqs.delete', module: 'faqs', description: 'Can delete FAQ entries' },
    { name: 'Manage FAQs', slug: 'faqs.manage', module: 'faqs', description: 'Full FAQ management access' },
    // Media module (additional)
    { name: 'Read Media', slug: 'media.read', module: 'media', description: 'Can view media assets' },
    { name: 'Manage Media', slug: 'media.manage', module: 'media', description: 'Full media library management access' },
    // Meetings module
    { name: 'Read Meetings', slug: 'meetings.read', module: 'meetings', description: 'Can view scheduled meetings' },
    {
      name: 'Manage Meetings',
      slug: 'meetings.manage',
      module: 'meetings',
      description: 'Can schedule, update, and cancel meetings',
    },
    // Chat module
    {
      name: 'Manage Support Conversations',
      slug: 'chat.manage',
      module: 'chat',
      description: 'Can view and join any client support conversation, not just ones already a participant in',
    },
    // Milestones module
    {
      name: 'Manage Milestones',
      slug: 'milestones.manage',
      module: 'milestones',
      description: 'Can create, update, and delete project milestones',
    },
    // Packages module (additional)
    {
      name: 'Manage Packages',
      slug: 'packages.manage',
      module: 'packages',
      description: 'Full package management access, including features and pricing',
    },
    // Portfolio module
    { name: 'Create Portfolio Items', slug: 'portfolio.create', module: 'portfolio', description: 'Can create portfolio projects' },
    { name: 'Update Portfolio Items', slug: 'portfolio.update', module: 'portfolio', description: 'Can update portfolio projects' },
    { name: 'Delete Portfolio Items', slug: 'portfolio.delete', module: 'portfolio', description: 'Can delete portfolio projects' },
    {
      name: 'Manage Portfolio',
      slug: 'portfolio.manage',
      module: 'portfolio',
      description: 'Full portfolio management access',
    },
    // Projects module
    { name: 'Read Projects', slug: 'projects.read', module: 'projects', description: 'Can view client projects' },
    { name: 'Create Projects', slug: 'projects.create', module: 'projects', description: 'Can create new projects' },
    { name: 'Update Projects', slug: 'projects.update', module: 'projects', description: 'Can update existing projects' },
    { name: 'Delete Projects', slug: 'projects.delete', module: 'projects', description: 'Can delete projects' },
    { name: 'Manage Projects', slug: 'projects.manage', module: 'projects', description: 'Full project management access' },
    // Reports (additional)
    {
      name: 'Generate Reports',
      slug: 'reports.generate',
      module: 'analytics',
      description: 'Can generate on-demand reports',
    },
    // SEO module
    { name: 'Create SEO Pages', slug: 'seo.create', module: 'seo', description: 'Can create SEO page configurations' },
    { name: 'Update SEO Pages', slug: 'seo.update', module: 'seo', description: 'Can update SEO page configurations' },
    { name: 'Delete SEO Pages', slug: 'seo.delete', module: 'seo', description: 'Can delete SEO page configurations' },
    { name: 'Manage SEO', slug: 'seo.manage', module: 'seo', description: 'Full SEO management access' },
    // Services module (additional)
    {
      name: 'Manage Services',
      slug: 'services.manage',
      module: 'services',
      description: 'Full service catalog management access',
    },
    // Settings module (additional)
    { name: 'Read Settings', slug: 'settings.read', module: 'settings', description: 'Can view platform settings' },
    // Tasks module
    {
      name: 'Manage Tasks',
      slug: 'tasks.manage',
      module: 'tasks',
      description: 'Can create, update, and delete project tasks',
    },
    // Team module
    {
      name: 'Assign Team',
      slug: 'team.assign',
      module: 'team',
      description: 'Can assign team members to projects',
    },
    // Testimonials module (additional)
    { name: 'Create Testimonials', slug: 'testimonials.create', module: 'testimonials', description: 'Can create testimonials' },
    { name: 'Update Testimonials', slug: 'testimonials.update', module: 'testimonials', description: 'Can update testimonials' },
    { name: 'Delete Testimonials', slug: 'testimonials.delete', module: 'testimonials', description: 'Can delete testimonials' },
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
    {
      name: 'Super Admin',
      slug: 'SUPER_ADMIN',
      description: 'System root administrator with complete access',
      type: RoleTypeEnum.SYSTEM,
    },
    {
      name: 'Admin',
      slug: 'ADMIN',
      description: 'Platform administrator with management access',
      type: RoleTypeEnum.SYSTEM,
    },
    {
      name: 'Content Manager',
      slug: 'CONTENT_MANAGER',
      description: 'Manages blogs, case studies, FAQs, and media',
      type: RoleTypeEnum.SYSTEM,
    },
    {
      name: 'Project Manager',
      slug: 'PROJECT_MANAGER',
      description: 'Manages client projects, orders, and timelines',
      type: RoleTypeEnum.SYSTEM,
    },
    {
      name: 'Marketing Manager',
      slug: 'MARKETING_MANAGER',
      description: 'Manages SEO, marketing campaigns, and analytics',
      type: RoleTypeEnum.SYSTEM,
    },
    {
      name: 'Support Agent',
      slug: 'SUPPORT',
      description: 'Handles client support tickets and inquiries',
      type: RoleTypeEnum.SYSTEM,
    },
    {
      name: 'Client',
      slug: 'CLIENT',
      description: 'Standard client user purchasing services and viewing projects',
      type: RoleTypeEnum.SYSTEM,
    },
    {
      name: 'Affiliate',
      slug: 'AFFILIATE',
      description: 'Affiliate partner referring new clients',
      type: RoleTypeEnum.SYSTEM,
    },
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

  // Content Manager gets blog, case study, media, service view perms, plus the
  // wider content-domain permissions (FAQs, portfolio, testimonials, SEO, and
  // the generic CMS content.* used by about-us/footer/homepage/navigation)
  // that its "Manages blogs, case studies, FAQs, and media" description implies.
  const contentPermSlugs = [
    'blogs.view',
    'blogs.create',
    'blogs.edit',
    'blogs.publish',
    'blogs.update',
    'blogs.manage',
    'caseStudies.view',
    'caseStudies.create',
    'caseStudies.edit',
    'caseStudies.publish',
    'casestudies.create',
    'casestudies.update',
    'casestudies.delete',
    'casestudies.manage',
    'media.view',
    'media.upload',
    'media.read',
    'media.manage',
    'services.view',
    'packages.view',
    'content.create',
    'content.read',
    'content.update',
    'content.delete',
    'faqs.create',
    'faqs.update',
    'faqs.delete',
    'faqs.manage',
    'portfolio.create',
    'portfolio.update',
    'portfolio.delete',
    'portfolio.manage',
    'testimonials.create',
    'testimonials.update',
    'testimonials.delete',
    'seo.create',
    'seo.update',
    'seo.delete',
    'seo.manage',
    'ai.use',
  ];
  await prisma.role.update({
    where: { id: createdRoles['CONTENT_MANAGER'] },
    data: { permissions: { set: contentPermSlugs.map((s) => ({ id: createdPermissions[s] })) } },
  });

  // Project Manager gets order, service, user view perms, plus everything
  // needed to actually run projects — tasks, milestones, deliverables,
  // meetings, and team assignment — matching its "Manages client projects,
  // orders, and timelines" description.
  const pmPermSlugs = [
    'orders.view',
    'orders.manage',
    'orders.create',
    'services.view',
    'packages.view',
    'users.view',
    'media.view',
    'media.upload',
    'documents.read',
    'documents.manage',
    'documents.upload',
    'dashboard.view',
    'clients.read',
    'projects.read',
    'projects.create',
    'projects.update',
    'projects.delete',
    'projects.manage',
    'tasks.manage',
    'milestones.manage',
    'deliverables.read',
    'deliverables.upload',
    'deliverables.approve',
    'meetings.read',
    'meetings.manage',
    'team.assign',
    'reports.generate',
    'reports.export',
    'analytics.view',
  ];
  await prisma.role.update({
    where: { id: createdRoles['PROJECT_MANAGER'] },
    data: { permissions: { set: pmPermSlugs.map((s) => ({ id: createdPermissions[s] })) } },
  });

  // Client gets basic read/create order perms, plus read + upload access to their own documents.
  // 'projects.read' is scoped to only the client's own project(s) in ProjectsService —
  // this permission alone does not grant visibility into other clients' projects.
  const clientPermSlugs = [
    'services.view',
    'packages.view',
    'orders.view',
    'orders.create',
    'documents.read',
    'documents.upload',
    'dashboard.view',
    'projects.read',
    'meetings.read',
  ];
  await prisma.role.update({
    where: { id: createdRoles['CLIENT'] },
    data: { permissions: { set: clientPermSlugs.map((s) => ({ id: createdPermissions[s] })) } },
  });

  // 4. Seed Default Super Admin User
  if (superAdminCredentials) {
    console.log('Seeding configured Super Admin user...');
    const hashedPassword = await bcrypt.hash(superAdminCredentials.password, 12);

    await prisma.user.upsert({
      where: { email: superAdminCredentials.email },
      update: {
        passwordHash: hashedPassword,
        status: UserStatusEnum.ACTIVE,
        roleId: createdRoles['SUPER_ADMIN'],
      },
      create: {
        email: superAdminCredentials.email,
        passwordHash: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        status: UserStatusEnum.ACTIVE,
        roleId: createdRoles['SUPER_ADMIN'],
      },
    });
  } else {
    console.log('Skipping Super Admin seed because seed credentials are not configured.');
  }

  // 5. Seed Services and Packages for Razorpay Checkout Flow
  console.log('Seeding Services and Packages...');

  const serviceSeeds = [
    {
      name: 'SEO',
      slug: 'seo',
      shortDescription: 'Rank higher and drive high-quality organic traffic with data-driven SEO.',
      type: 'RETAINER',
      basePrice: 5000,
    },
    {
      name: 'Google Ads',
      slug: 'google-ads',
      shortDescription: 'Generate qualified leads with high-converting Google Ads campaigns.',
      type: 'RETAINER',
      basePrice: 8000,
    },
    {
      name: 'Meta Ads',
      slug: 'meta-ads',
      shortDescription: 'Scale with targeted Facebook and Instagram advertising campaigns.',
      type: 'RETAINER',
      basePrice: 4999,
    },
    {
      name: 'Website Design',
      slug: 'website-design',
      shortDescription: 'Build a fast, responsive, and conversion-focused business website.',
      type: 'ONE_TIME',
      basePrice: 14999,
    },
    {
      name: 'E-Commerce',
      slug: 'ecommerce',
      shortDescription: 'Launch and grow a high-performing online store built for conversions.',
      type: 'ONE_TIME',
      basePrice: 19999,
    },
    {
      name: 'Video Editing',
      slug: 'video-editing',
      shortDescription: 'Create polished videos, reels, and motion graphics that hold attention.',
      type: 'RETAINER',
      basePrice: 5999,
    },
    {
      name: 'Graphic Design',
      slug: 'graphic-design',
      shortDescription: 'Create distinctive digital and print visuals for every marketing channel.',
      type: 'RETAINER',
      basePrice: 5999,
    },
  ] as const;

  const seededServices = await Promise.all(
    serviceSeeds.map((service) =>
      prisma.service.upsert({
        where: { slug: service.slug },
        update: {
          name: service.name,
          shortDescription: service.shortDescription,
          type: service.type,
          basePrice: service.basePrice,
          deletedAt: null,
        },
        create: service,
      }),
    ),
  );

  const seoService = seededServices.find((service) => service.slug === 'seo');
  const adsService = seededServices.find((service) => service.slug === 'google-ads');

  if (!seoService || !adsService) {
    throw new Error('Required package services were not seeded.');
  }

  // Seed SEO Packages
  const seoPackages = [
    {
      name: 'SEO Basic Plan',
      slug: 'seo-basic',
      description: 'Basic SEO package for small businesses.',
      price: 5000,
      type: 'STARTER',
    },
    {
      name: 'SEO Monthly Growth',
      slug: 'seo-monthly',
      description: 'Ongoing monthly SEO strategy and execution.',
      price: 7999,
      type: 'PROFESSIONAL',
    },
    {
      name: 'SEO Standard Plan',
      slug: 'seo-standard',
      description: 'Standard SEO package for growing businesses.',
      price: 10000,
      type: 'PROFESSIONAL',
    },
    {
      name: 'SEO Premium Plan',
      slug: 'seo-premium',
      description: 'Premium SEO package with advanced analytics.',
      price: 20000,
      type: 'ENTERPRISE',
    },
    {
      name: 'SEO Enterprise Plan',
      slug: 'seo-enterprise',
      description: 'Enterprise SEO package for large scale operations.',
      price: 50000,
      type: 'ENTERPRISE',
    },
  ];

  for (const pkg of seoPackages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: { name: pkg.name, description: pkg.description, basePrice: pkg.price, type: pkg.type as any },
      create: {
        name: pkg.name,
        slug: pkg.slug,
        description: pkg.description,
        basePrice: pkg.price,
        type: pkg.type as any,
        serviceId: seoService.id,
      },
    });
  }

  // Seed Ads Packages
  const adsPackages = [
    {
      name: 'Google Ads Starter',
      slug: 'ads-starter',
      description: 'Google Ads setup and basic management.',
      price: 8000,
      type: 'STARTER',
    },
    {
      name: 'Google Ads Growth',
      slug: 'ads-growth',
      description: 'Advanced Google Ads management and optimization.',
      price: 15000,
      type: 'PROFESSIONAL',
    },
    {
      name: 'Google Ads Scale',
      slug: 'ads-scale',
      description: 'High-budget Google Ads management for scaling.',
      price: 30000,
      type: 'ENTERPRISE',
    },
    {
      name: 'Google Ads Premium',
      slug: 'ads-premium',
      description: 'Enterprise Google Ads management for max reach.',
      price: 60000,
      type: 'ENTERPRISE',
    },
  ];

  for (const pkg of adsPackages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: { name: pkg.name, description: pkg.description, basePrice: pkg.price, type: pkg.type as any },
      create: {
        name: pkg.name,
        slug: pkg.slug,
        description: pkg.description,
        basePrice: pkg.price,
        type: pkg.type as any,
        serviceId: adsService.id,
      },
    });
  }

  console.log('✅ Database seeding completed successfully.');
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error('❌ Error during database seeding:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
