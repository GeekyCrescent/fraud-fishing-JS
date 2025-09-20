import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UserModule } from './users/user.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ReportModule } from './reports/report.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET
  }),
  ConfigModule.forRoot({
    isGlobal: true
  }),
    DbModule, UserModule, AuthModule, AdminModule, ReportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
