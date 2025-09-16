import { UserService } from "src/users/user.service";
import { TokenService } from "./tokens.service";
import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request";
import { ApiBearerAuth, ApiProperty, ApiBody } from "@nestjs/swagger";


export class LoginDto {
  @ApiProperty({ example: "user@email.com" })
  email: string;
  @ApiProperty({ example: "password123" })
  password: string;
}

export class RefreshDto {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  refreshToken: string;
}

@Controller("auth")
export class AuthController{
    constructor(private readonly tokenService: TokenService,
        private readonly userService: UserService){}

    @Post("login")
    @ApiBody({ type: LoginDto })
    async login(@Body() dto: LoginDto){
        const usuario= await this.userService.login(dto.email, dto.password);
        if(!usuario)
            throw Error("Usuario no encontrado");
        const userProfile = {id: usuario.id.toString(), email: usuario.email, name: usuario.name};
        const accessToken = await this.tokenService.generateAccess(userProfile);
        const refreshToken= await this.tokenService.generateRefresh(usuario.id.toString());
        return { accessToken, refreshToken };
    }

    @Get("profile")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    getProfile(@Req() req: AuthenticatedRequest){
        return {profile: req.user.profile}
    }

    @Post("refresh")
    @ApiBody({ type: RefreshDto })
    async refresh(@Body() dto: RefreshDto) {
        try{
            const profile= await this.tokenService.verifyRefresh(dto.refreshToken);
            const user= await this.userService.findById(Number(profile.sub));
            if(!user) throw Error("Usuario no encontrado");
            const newAccessToken = await this.tokenService.generateAccess({id: user.id.toString(), email: user.email, name: user.name});
            return {accessToken: newAccessToken};
        }catch{
            throw Error("Token de refresco inválido");
        }
    }

}