import { Controller, Get } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { UserDto } from '../users/user.service';

@Controller('admin/user')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('list')
  async listAllUsers(): Promise<UserDto[]> {
    return this.adminService.findAllUsers();
  }
}