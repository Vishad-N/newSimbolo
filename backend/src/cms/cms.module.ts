import { Module } from '@nestjs/common';
import { CmsService } from './cms.service';
import { HomepageController } from './controllers/homepage.controller';
import { AboutUsController } from './controllers/about-us.controller';
import { HelpCenterController } from './controllers/help-center.controller';
import { NavigationController } from './controllers/navigation.controller';
import { FooterController } from './controllers/footer.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    HomepageController,
    AboutUsController,
    HelpCenterController,
    NavigationController,
    FooterController,
  ],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
