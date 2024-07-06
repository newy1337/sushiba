import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { SettingsModule } from './settings/settings.module';
import { PromocodeModule } from './promocode/promocode.module';

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
  providers: [AppService],
})
export class AppModule {}
