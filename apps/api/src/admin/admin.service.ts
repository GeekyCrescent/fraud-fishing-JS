import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { UserDto } from '../users/user.service';
import { ReportRepository } from '../reports/report.repository';
import { ReportDto } from '../reports/report.service';
import { sha256 } from 'src/util/crypto/hash.util';

@Injectable()
export class AdminService {
    constructor(private readonly userRepository: UserRepository, private readonly reportRepository: ReportRepository) {}

    // Endpoints para Usuarios (Users)

    async findAllUsers(): Promise<UserDto[]> {
        const users = await this.userRepository.findAll();
        return users.map(user => ({ email: user.email, name: user.name }));
    }

    async findUserById(id: number): Promise<UserDto> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return { email: user.email, name: user.name };
    }

    async updateUserById(id: number, name: string, password: string): Promise<UserDto | void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        user.name = name;
        const hashedPassword = sha256(password);
        user.password_hash = hashedPassword;
        await this.userRepository.updateUser(user);
        return { email: user.email, name: user.name };
    }

    // Endpoints para Reportes (Reports)

    async findAllReports(): Promise<ReportDto[]> {
        return this.reportRepository.findAllReports();
    }

    async updateReportById(id: number, status: string): Promise<ReportDto | void> {
        return this.reportRepository.updateReportStatus(id, status);
    }
}