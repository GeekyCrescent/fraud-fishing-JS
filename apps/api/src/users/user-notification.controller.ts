import { Controller, Get, Put, Delete, Patch, Post, Param, Body, Query, Request, UseGuards, ParseIntPipe, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { NotificationService } from '../notifications/notification.service';
import type { AuthenticatedRequest } from "../common/interfaces/authenticated-request"; 

import {NotificationWithTypeDto,NotificationCountDto,NotificationSummaryDto,HasUnreadDto,UpdatePreferenceDto,UpdateAllPreferencesDto,NotificationPreferenceCheckDto,SuccessMessageDto, UserNotificationPreferenceDto} from '../notifications/dto/notification.dto';


@ApiTags("Endpoints de Usuarios - Notificaciones")
@Controller('users/notifications')
export class UserNotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    // ===== MIS NOTIFICACIONES =====

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener mis notificaciones paginadas' })
    @ApiResponse({ status: 200, description: 'Lista de notificaciones', type: [NotificationWithTypeDto] })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    async getMyNotifications(
        @Req() req: AuthenticatedRequest,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
        @Query('offset', new ParseIntPipe({ optional: true })) offset?: number
    ): Promise<NotificationWithTypeDto[]> {
        const userId = req.user.profile.id;
        return this.notificationService.getNotificationsByUserId(Number(userId), limit || 50, offset || 0);
    }

    @Get('unread')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener mis notificaciones no leídas' })
    @ApiResponse({ status: 200, description: 'Lista de notificaciones no leídas', type: [NotificationWithTypeDto] })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    async getMyUnreadNotifications(@Req() req: AuthenticatedRequest): Promise<NotificationWithTypeDto[]> {
        const userId = req.user.profile.id;
        return this.notificationService.getUnreadNotificationsByUserId(Number(userId));
    }

    @Get('unread/count')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener contador de notificaciones no leídas' })
    @ApiResponse({ status: 200, description: 'Contador de no leídas', type: NotificationCountDto })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    async getMyUnreadCount(@Req() req: AuthenticatedRequest): Promise<NotificationCountDto> {
        const userId = req.user.profile.id;
        const count = await this.notificationService.getUnreadCountByUserId(Number(userId));
        return { count };
    }

    @Get('summary')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener resumen de mis notificaciones' })
    @ApiResponse({ status: 200, description: 'Resumen completo', type: NotificationSummaryDto })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    async getMyNotificationSummary(@Req() req: AuthenticatedRequest): Promise<NotificationSummaryDto> {
        const userId = req.user.profile.id;
        return this.notificationService.getNotificationSummary(Number(userId));
    }

    @Get('has-unread')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Verificar si tengo notificaciones no leídas' })
    @ApiResponse({ status: 200, description: 'Estado de no leídas', type: HasUnreadDto })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    async hasUnreadNotifications(@Req() req: AuthenticatedRequest): Promise<HasUnreadDto> {
        const userId = req.user.profile.id;
        const hasUnread = await this.notificationService.hasUnreadNotifications(Number(userId));
        return { hasUnread };
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener una notificación específica' })
    @ApiResponse({ status: 200, description: 'Detalle de notificación', type: NotificationWithTypeDto })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    @ApiResponse({ status: 403, description: 'No tienes permiso para ver esta notificación' })
    async getMyNotificationById(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AuthenticatedRequest
    ): Promise<NotificationWithTypeDto> {
        const notification = await this.notificationService.getNotificationById(id);
        
        if (notification.user_id !== Number(req.user.profile.id)) {
            throw new Error('No tienes permiso para ver esta notificación');
        }

        return notification;
    }

    // ===== MARCAR COMO LEÍDO/NO LEÍDO =====

    @Patch(':id/read')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Marcar notificación como leída' })
    @ApiResponse({ status: 204, description: 'Notificación marcada como leída' })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    async markAsRead(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AuthenticatedRequest
    ): Promise<void> {
        const userId = req.user.profile.id;
        await this.notificationService.markAsRead(id, Number(userId));
    }

    @Patch(':id/unread')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Marcar notificación como no leída' })
    @ApiResponse({ status: 204, description: 'Notificación marcada como no leída' })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    async markAsUnread(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AuthenticatedRequest
    ): Promise<void> {
        const userId = req.user.profile.id;
        await this.notificationService.markAsUnread(id, Number(userId));
    }

    @Patch('read-all')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Marcar todas mis notificaciones como leídas' })
    @ApiResponse({ status: 204, description: 'Todas las notificaciones marcadas como leídas' })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    async markAllAsRead(@Req() req: AuthenticatedRequest): Promise<void> {
        const userId = req.user.profile.id;
        await this.notificationService.markAllAsReadByUserId(Number(userId));
    }

    // ===== MIS PREFERENCIAS =====

    @Get('preferences')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener mis preferencias de notificación' })
    @ApiResponse({ status: 200, description: 'Lista de preferencias', type: [UserNotificationPreferenceDto] })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    async getMyPreferences(@Req() req: AuthenticatedRequest): Promise<UserNotificationPreferenceDto[]> {
        const userId = req.user.profile.id;
        return this.notificationService.getUserPreferences(Number(userId));
    }

    @Put('preferences')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Actualizar una preferencia específica' })
    @ApiResponse({ status: 204, description: 'Preferencia actualizada' })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    async updateMyPreference(
        @Req() req: AuthenticatedRequest,
        @Body() updatePreferenceDto: UpdatePreferenceDto
    ): Promise<void> {
        const userId = req.user.profile.id;
        await this.notificationService.updateUserPreference(
            Number(userId),
            updatePreferenceDto.typeId,
            updatePreferenceDto.enabled,
            updatePreferenceDto.emailEnabled,
            updatePreferenceDto.pushEnabled
        );
    }

    @Put('preferences/bulk')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Actualizar todas mis preferencias' })
    @ApiResponse({ status: 204, description: 'Todas las preferencias actualizadas' })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    async updateAllMyPreferences(
        @Req() req: AuthenticatedRequest,
        @Body() updateAllPreferencesDto: UpdateAllPreferencesDto
    ): Promise<void> {
        const userId = req.user.profile.id;
        await this.notificationService.updateAllUserPreferences(Number(userId), updateAllPreferencesDto.preferences);
    }

    @Post('preferences/defaults')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear preferencias por defecto' })
    @ApiResponse({ status: 201, description: 'Preferencias creadas', type: SuccessMessageDto })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    async createMyDefaultPreferences(@Req() req: AuthenticatedRequest): Promise<SuccessMessageDto> {
        const userId = req.user.profile.id;
        await this.notificationService.createDefaultPreferencesForUser(Number(userId));
        return { message: 'Preferencias por defecto creadas exitosamente' };
    }

    @Get('preferences/check/:typeId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Verificar preferencia para un tipo específico' })
    @ApiResponse({ status: 200, description: 'Estado de preferencia', type: NotificationPreferenceCheckDto })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    async checkMyPreferenceForType(
        @Param('typeId', ParseIntPipe) typeId: number,
        @Req() req: AuthenticatedRequest
    ): Promise<NotificationPreferenceCheckDto> {
        const userId = req.user.profile.id;
        return this.notificationService.getUserWantsNotificationType(Number(userId), typeId);
    }

    // ===== ELIMINAR MIS NOTIFICACIONES =====

    @Delete('all')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar todas mis notificaciones' })
    @ApiResponse({ status: 204, description: 'Todas las notificaciones eliminadas' })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    async deleteAllMyNotifications(@Req() req: AuthenticatedRequest): Promise<void> {
        const userId = req.user.profile.id;
        await this.notificationService.deleteAllUserNotifications(Number(userId));
    }
}