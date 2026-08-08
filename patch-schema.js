const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'backend', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Add Media model
const mediaModel = `
/// Purpose: Cloudinary-backed Media Library for CMS assets.
/// Relationships: Referenced by Blog, CaseStudy, PortfolioProject, Service, etc.
model Media {
  id           String   @id @default(uuid()) @db.Uuid
  publicId     String   @unique
  url          String
  secureUrl    String
  folder       String   // e.g. "blogs/covers", "services", "homepage"
  filename     String
  format       String
  resourceType String
  width        Int?
  height       Int?
  bytes        Int?
  uploadedById String?  @db.Uuid
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  uploadedBy User? @relation("MediaUploaderCloudinary", fields: [uploadedById], references: [id], onDelete: SetNull)
  
  // Relations to CMS modules
  companies             Company[]
  services              Service[]
  blogs                 Blog[]
  blogAuthors           BlogAuthor[]
  caseStudies           CaseStudy[]
  portfolioProjects     PortfolioProject[]
  testimonials          Testimonial[]
  seoPages              SEOPage[]
  themeSettingsDark     ThemeSetting[] @relation("DarkModeLogo")
  themeSettingsLight    ThemeSetting[] @relation("LightModeLogo")
  beforeComparisons     BeforeAfterComparison[] @relation("BeforeMedia")
  afterComparisons      BeforeAfterComparison[] @relation("AfterMedia")

  @@index([folder])
  @@index([publicId])
  @@map("media")
}
`;

if (!schema.includes('model Media {')) {
  schema += '\n' + mediaModel;
}

// 2. Add relation to User
schema = schema.replace(
  'mediaUploaded       MediaAsset[]            @relation("MediaUploader")',
  'mediaUploaded       MediaAsset[]            @relation("MediaUploader")\n  mediaUploadedCloudinary Media[]               @relation("MediaUploaderCloudinary")'
);

// 3. Update Company
schema = schema.replace(
  'logoUrl          String?',
  'logoMediaId      String?   @db.Uuid'
);
if (!schema.includes('logoMedia Media? @relation(fields: [logoMediaId], references: [id])')) {
  schema = schema.replace(
    'documents Document[]',
    'documents Document[]\n  logoMedia Media? @relation(fields: [logoMediaId], references: [id])'
  );
}

// 4. Update Service
schema = schema.replace(
  'iconUrl          String?',
  'iconMediaId      String?                     @db.Uuid'
);
if (!schema.includes('iconMedia      Media?             @relation(fields: [iconMediaId], references: [id])')) {
  schema = schema.replace(
    'generalFaqs    FAQ[]',
    'generalFaqs    FAQ[]\n  iconMedia      Media?             @relation(fields: [iconMediaId], references: [id])'
  );
}

// 5. Update Blog
schema = schema.replace(
  'coverImage MediaAsset?   @relation(fields: [coverImageId], references: [id])',
  'coverImage Media?        @relation(fields: [coverImageId], references: [id])'
);

// 6. Update BlogAuthor
schema = schema.replace(
  'avatarUrl   String?',
  'avatarMediaId String? @db.Uuid'
);
if (!schema.includes('avatarMedia Media? @relation(fields: [avatarMediaId], references: [id])')) {
  schema = schema.replace(
    'blogs       Blog[]',
    'blogs       Blog[]\n  avatarMedia Media? @relation(fields: [avatarMediaId], references: [id])'
  );
}

// 7. Update CaseStudy
schema = schema.replace(
  'coverImage   MediaAsset?             @relation(fields: [coverImageId], references: [id])',
  'coverImage   Media?                  @relation(fields: [coverImageId], references: [id])'
);

// 8. Update BeforeAfterComparison
schema = schema.replace(
  'beforeImage MediaAsset @relation("BeforeImage", fields: [beforeImageId], references: [id])',
  'beforeMedia Media @relation("BeforeMedia", fields: [beforeImageId], references: [id])'
);
schema = schema.replace(
  'afterImage  MediaAsset @relation("AfterImage", fields: [afterImageId], references: [id])',
  'afterMedia  Media @relation("AfterMedia", fields: [afterImageId], references: [id])'
);

// 9. Update PortfolioProject
schema = schema.replace(
  'coverImage MediaAsset?        @relation(fields: [coverImageId], references: [id])',
  'coverImage Media?             @relation(fields: [coverImageId], references: [id])'
);

// 10. Update Testimonial
schema = schema.replace(
  'avatarUrl      String?',
  'avatarMediaId  String?                     @db.Uuid'
);
if (!schema.includes('avatarMedia Media? @relation(fields: [avatarMediaId], references: [id])')) {
  schema = schema.replace(
    'client         ClientProfile?              @relation(fields: [clientId], references: [id])',
    'client         ClientProfile?              @relation(fields: [clientId], references: [id])\n  avatarMedia    Media?                      @relation(fields: [avatarMediaId], references: [id])'
  );
}

// 11. Update SEOPage
if (!schema.includes('ogImage         Media?   @relation(fields: [ogImageId], references: [id])')) {
  schema = schema.replace(
    'package         Package?',
    'package         Package?\n  ogImage         Media?   @relation(fields: [ogImageId], references: [id])'
  );
}

// 12. Update ThemeSetting
schema = schema.replace(
  'darkModeLogoUrl  String?',
  'darkModeLogoId   String?  @db.Uuid'
);
schema = schema.replace(
  'lightModeLogoUrl String?',
  'lightModeLogoId  String?  @db.Uuid'
);
if (!schema.includes('darkModeLogo     Media?   @relation("DarkModeLogo", fields: [darkModeLogoId], references: [id])')) {
  schema = schema.replace(
    'createdAt        DateTime @default(now())',
    'createdAt        DateTime @default(now())\n\n  darkModeLogo     Media?   @relation("DarkModeLogo", fields: [darkModeLogoId], references: [id])\n  lightModeLogo    Media?   @relation("LightModeLogo", fields: [lightModeLogoId], references: [id])'
  );
}

// 13. Remove backward relations from MediaAsset
schema = schema.replace(/  blogCovers          Blog\[\]\n/g, '');
schema = schema.replace(/  caseStudyCovers     CaseStudy\[\]\n/g, '');
schema = schema.replace(/  beforeComparisons   BeforeAfterComparison\[\] @relation\("BeforeImage"\)\n/g, '');
schema = schema.replace(/  afterComparisons    BeforeAfterComparison\[\] @relation\("AfterImage"\)\n/g, '');
schema = schema.replace(/  portfolioCovers     PortfolioProject\[\]\n/g, '');

fs.writeFileSync(schemaPath, schema);
console.log('Schema updated successfully.');
