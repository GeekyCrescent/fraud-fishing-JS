import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { UserDto, UpdateUserDto } from '../users/dto/user.dto';
import { ReportRepository } from '../reports/report.repository';
import { sha256 } from 'src/util/crypto/hash.util';
import { UserStatsDto, UserStatsResponseDto } from './dto/user-stats.dto';


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
        return users.map(user => ({id: user.id, email: user.email, name: user.name, is_admin: user.is_admin ? 1 : 0 }));
    }

    async findUserById(id: number): Promise<UserDto> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return { email: user.email, name: user.name };
    }

    async getUsersWithStats(): Promise<UserStatsResponseDto> {
        const usersData = await this.userRepository.findAllUsersWithStats();

        const userStats: UserStatsDto[] = usersData.map(user => ({
            id: Number(user.id),
            name: user.name,
            email: user.email,
            is_admin: Boolean(user.is_admin),
            created_at: user.created_at,
            reportCount: Number(user.reportCount) || 0,
            commentCount: Number(user.commentCount) || 0,
            likeCount: Number(user.likeCount) || 0,
        }));

        const totalUsers = userStats.length;
        const totalAdmins = userStats.filter(u => u.is_admin).length;
        const totalRegularUsers = totalUsers - totalAdmins;

        return {
            users: userStats,
            totalUsers,
            totalAdmins,
            totalRegularUsers,
        };
    }

    async getTopActiveUsers(limit: number = 10): Promise<UserStatsDto[]> {
        try {
            const usersData = await this.userRepository.findAllUsersWithStats();
            
            // Transformar y calcular puntuación de actividad
            const userStats: (UserStatsDto & { activityScore: number })[] = usersData.map(user => {
                const reports = parseInt(user.reportCount) || 0;
                const comments = parseInt(user.commentCount) || 0;
                const likes = parseInt(user.likeCount) || 0;
                
                // Calcular puntuación de actividad (puedes ajustar los pesos)
                const activityScore = (reports * 3) + (comments * 2) + (likes * 1);
                
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    is_admin: Boolean(user.is_admin),
                    reportCount: reports,
                    commentCount: comments,
                    likeCount: likes,
                    created_at: user.created_at,
                    activityScore,
                };
            });

            // Ordenar por puntuación de actividad y tomar los primeros
            return userStats
                .sort((a, b) => b.activityScore - a.activityScore)
                .slice(0, limit)
                .map(({ activityScore, ...user }) => user); // Remover activityScore del resultado
        } catch (error) {
            throw new Error(`Error al obtener usuarios más activos: ${error.message}`);
        }
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