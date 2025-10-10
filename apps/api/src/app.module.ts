/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UserModule } from './users/user.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ReportModule } from './reports/report.module';
import { CategoryModule } from './categories/category.module';

@Module({
  imports: [JwtModule.register({
      global: true,
      secret:"supersecret"
  }), 
  DbModule, UserModule, AuthModule, AdminModule, ReportModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}