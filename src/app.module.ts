import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';
import { SettingsModule } from './modules/settings/settings.module';
import { PromocodeModule } from './modules/promocode/promocode.module';
import { AwsConfigService } from './utils/aws.config';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    UserModule,
    OrderModule,
    SettingsModule,
    PromocodeModule,
  ],
  controllers: [AppController],
  providers: [AppService, AwsConfigService],
})
export class AppModule {}
