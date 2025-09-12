import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserRepository } from '../users/user.repository';

@Module({
  controllers: [AdminController],
  providers: [AdminService, UserRepository],
})
export class AdminModule {}