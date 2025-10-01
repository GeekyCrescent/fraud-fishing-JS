import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { UserDto, UpdateUserDto } from '../users/dto/user.dto';
import { ReportRepository } from '../reports/report.repository';
import { sha256 } from 'src/util/crypto/hash.util';


@Injectable()
export class AdminService {
    constructor(private readonly userRepository: UserRepository, private readonly reportRepository: ReportRepository) {}

    // ========== | ADMIN Endpoints | ==========

    //  POSTs

    async registerAdmin(email: string, name: string, password: string): Promise<UserDto | void> {
        const existingAdmin = await this.userRepository.findByEmail(email);
        if (existingAdmin) {
            throw new Error('El correo electrónico ya está en uso');
        }
        const salt = "salt";
        const hashedPassword = sha256(password);
        return this.userRepository.registerUser(email, name, hashedPassword, salt, true);
    }

    // ========== | USER Endpoints | ==========

    //  GETs

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

    //  PUTs
    async updateUserById(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        if (updateUserDto.name !== undefined) {
            user.name = updateUserDto.name;
        }
        if (updateUserDto.password !== undefined) {
            user.password_hash = sha256(updateUserDto.password);
        }
        await this.userRepository.updateUser(user);
        
        return { email: user.email, name: user.name };
    }
}