import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './controllers/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './controllers/category/category.module';
import { ProductModule } from './controllers/product/product.module';
import { UserModule } from './controllers/user/user.module';
import { OrderModule } from './controllers/order/order.module';
import { SettingsModule } from './controllers/settings/settings.module';
import { PromocodeModule } from './controllers/promocode/promocode.module';
import { AwsConfigService } from './utils/aws.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
