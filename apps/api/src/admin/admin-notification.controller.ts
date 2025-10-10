import { Controller, Post, Delete,Get,Body, Param, Query,ParseIntPipe} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';
import { NotificationService } from '../notifications/notification.service';

// Importar DTOs
import {CreateNotificationDto,CreateBulkNotificationDto,SendSystemAnnouncementDto,SendAdminMessageDto,SuccessMessageDto,BulkOperationResponseDto,NotificationWithTypeDto,UserNotificationPreferenceDto,NotificationSummaryDto} from '../notifications/dto/notification.dto';

@ApiTags('Endpoints de Administrador - Notificaciones')
@Controller('admin/notifications')
export class AdminNotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    @ApiOperation({ summary: 'Crear notificación específica' })
    @ApiResponse({ status: 201, description: 'Notificación creada' })
    async createNotification(@Body() createNotificationDto: CreateNotificationDto): Promise<SuccessMessageDto> {
        await this.notificationService.createNotification(
            createNotificationDto.userId,
            createNotificationDto.typeId,
            createNotificationDto.title,
            createNotificationDto.message,
            createNotificationDto.relatedId
        );
        
        return { 
            message: `Notificación creada exitosamente para el usuario ${createNotificationDto.userId}` 
        };
    }

    @Post('bulk')
    @ApiOperation({ summary: 'Crear notificaciones masivas' })
    @ApiResponse({ status: 201, description: 'Notificaciones masivas creadas' })
    async createBulkNotifications(@Body() createBulkNotificationDto: CreateBulkNotificationDto): Promise<BulkOperationResponseDto> {
        await this.notificationService.createBulkNotifications(createBulkNotificationDto.notifications);
        
        return { 
            message: 'Notificaciones masivas procesadas exitosamente',
            created: createBulkNotificationDto.notifications.length
        };
    }

    @Post('system-announcement')
    @ApiOperation({ summary: 'Enviar anuncio del sistema' })
    @ApiResponse({ status: 201, description: 'Anuncio enviado' })
    async sendSystemAnnouncement(@Body() sendSystemAnnouncementDto: SendSystemAnnouncementDto): Promise<BulkOperationResponseDto> {
        await this.notificationService.sendSystemAnnouncement(
            sendSystemAnnouncementDto.title,
            sendSystemAnnouncementDto.message,
            sendSystemAnnouncementDto.userIds
        );
        
        return { 
            message: 'Anuncio del sistema enviado exitosamente',
            sentTo: sendSystemAnnouncementDto.userIds.length
        };
    }

    @Post('admin-message')
    @ApiOperation({ summary: 'Enviar mensaje administrativo' })
    @ApiResponse({ status: 201, description: 'Mensaje enviado' })
    async sendAdminMessage(@Body() sendAdminMessageDto: SendAdminMessageDto): Promise<SuccessMessageDto> {
        await this.notificationService.sendAdminMessage(
            sendAdminMessageDto.userId,
            sendAdminMessageDto.title,
            sendAdminMessageDto.message,
            sendAdminMessageDto.relatedId
        );
        
        return { 
            message: `Mensaje administrativo enviado al usuario ${sendAdminMessageDto.userId}` 
        };
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Obtener notificaciones de usuario' })
    @ApiResponse({ status: 200, description: 'Lista de notificaciones' })
    async getUserNotifications(
        @Param('userId', ParseIntPipe) userId: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
        @Query('offset', new ParseIntPipe({ optional: true })) offset?: number
    ): Promise<NotificationWithTypeDto[]> {
        return this.notificationService.getNotificationsByUserId(userId, limit || 50, offset || 0);
    }

    @Get('user/:userId/unread')
    @ApiOperation({ summary: 'Obtener notificaciones no leídas' })
    @ApiResponse({ status: 200, description: 'Notificaciones no leídas' })
    async getUserUnreadNotifications(@Param('userId', ParseIntPipe) userId: number): Promise<NotificationWithTypeDto[]> {
        return this.notificationService.getUnreadNotificationsByUserId(userId);
    }

    @Get('user/:userId/summary')
    @ApiOperation({ summary: 'Resumen de notificaciones' })
    @ApiResponse({ status: 200, description: 'Resumen completo' })
    async getUserNotificationSummary(@Param('userId', ParseIntPipe) userId: number): Promise<NotificationSummaryDto> {
        return this.notificationService.getNotificationSummary(userId);
    }

    @Get('user/:userId/preferences')
    @ApiOperation({ summary: 'Ver preferencias de usuario' })
    @ApiResponse({ status: 200, description: 'Preferencias del usuario' })
    async getUserPreferences(@Param('userId', ParseIntPipe) userId: number): Promise<UserNotificationPreferenceDto[]> {
        return this.notificationService.getUserPreferences(userId);
    }

    @Delete('user/:userId/all')
    @ApiOperation({ summary: 'Eliminar todas las notificaciones de usuario' })
    @ApiResponse({ status: 200, description: 'Notificaciones eliminadas' })
    async deleteAllUserNotifications(@Param('userId', ParseIntPipe) userId: number): Promise<void> {
        await this.notificationService.deleteAllUserNotifications(userId);
    }

    @Delete('cleanup/:days')
    @ApiOperation({ summary: 'Limpiar notificaciones antiguas' })
    @ApiResponse({ status: 200, description: 'Limpieza completada' })
    async cleanupOldNotifications(@Param('days', ParseIntPipe) days: number): Promise<void> {
        if (days < 1 || days > 365) {
            throw new Error('El número de días debe estar entre 1 y 365');
        }
        
        await this.notificationService.deleteOldNotifications(days);
    }

    @Post('test-notification/:adminId')
    @ApiOperation({ summary: 'Enviar notificación de prueba' })
    @ApiResponse({ status: 201, description: 'Notificación de prueba enviada' })
    async sendTestNotification(@Param('adminId', ParseIntPipe) adminId: number): Promise<SuccessMessageDto> {
        await this.notificationService.createNotification(
            adminId,
            5,
            '🧪 Notificación de prueba',
            'Esta es una notificación de prueba enviada desde el panel de administración.',
        );
        
        return { 
            message: 'Notificación de prueba enviada exitosamente' 
        };
    }
}