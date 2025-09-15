import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { UserDto } from '../users/user.service';

@Injectable()
export class AdminService {
    constructor(private readonly userRepository: UserRepository) {}

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
}