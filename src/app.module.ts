import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { TokenService } from './token/token.service';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration]
    }),
    DatabaseModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    ReviewsModule,
    AuthModule,
    RoleModule,
    TokenModule
  ],
  providers: [TokenService]
})
export class AppModule {}
