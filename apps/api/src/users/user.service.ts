import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User, UserRepository } from "./user.repository";
import { sha256 } from "../util/crypto/hash.util";
import { ApiProperty } from "@nestjs/swagger";
import { ReportRepository } from "../reports/report.repository";

export class UserDto {
    @ApiProperty({ example: "user@example.com", description: "Email del usuario" })
    email: string;
    @ApiProperty({ example: "Nombre de Usuario", description: "Nombre del usuario" })
    name: string;
}

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, 
                private readonly reportRepository: ReportRepository) {}

    async registerUser(email:string, name:string, password:string):Promise<UserDto|void>{
        console.log("Aqui hacemos el hash del password")
        const hashedPassword = sha256(password);
        return this.userRepository.registerUser(email, name, hashedPassword, "user");
    }

    async login(email:string, password:string):Promise<User>{
        const user= await this.userRepository.findByEmail(email);
        if(!user) throw Error("Usuario no encontrado");
        if(user.password_hash !== sha256(password)){
            throw new UnauthorizedException("Contraseña incorrecta");
        }
        return user;
    }

    async findById(id:number):Promise<User>{
        return this.userRepository.findById(id);
    }

    async updateUserById(id: number, name: string, password: string): Promise<UserDto | void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        const hashedPassword = sha256(password);
        user.name = name;
        user.password_hash = hashedPassword;
        await this.userRepository.updateUser(user);
        return { email: user.email, name: user.name };
    }

    async getUsers():Promise<UserDto[]>{
        const users = await this.userRepository.findAll();
        return users.map(user => ({ email: user.email, name: user.name }));
    }

    async getUserReportsCompleted(userId: number): Promise<any[]> {
        return this.reportRepository.findCompletedReportsByUserId(userId);
    }

    async getUserReportsActive(userId: number): Promise<any[]> {
        return this.reportRepository.findActiveReportsByUserId(userId);
    }
}