import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { NotificationService, NOTIFICATION_TYPES } from './notification.service';
import { NotificationType } from './notification.repository';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    // ===== ENDPOINTS PÚBLICOS =====

    @Get('types')
    async getNotificationTypes(): Promise<NotificationType[]> {
        return this.notificationService.getNotificationTypes();
    }

    @Get('types/:id')
    async getNotificationTypeById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<NotificationType> {
        return this.notificationService.getNotificationTypeById(id);
    }

    @Get('constants/types')
    getNotificationTypeConstants(): typeof NOTIFICATION_TYPES {
        return NOTIFICATION_TYPES;
    }

    // ===== ENDPOINTS INTERNOS PARA OTROS SERVICIOS =====

    @Post('internal/report-status-change')
    async notifyReportStatusChange(@Body() body: {
        userId: number;
        reportId: number;
        reportTitle: string;
        newStatus: string;
    }): Promise<{ message: string }> {
        await this.notificationService.notifyReportStatusChange(
            body.userId,
            body.reportId,
            body.reportTitle,
            body.newStatus
        );
        return { message: 'Notificación de cambio de estado enviada' };
    }

    @Post('internal/new-comment')
    async notifyNewComment(@Body() body: {
        userId: number;
        reportId: number;
        reportTitle: string;
        commenterName: string;
    }): Promise<{ message: string }> {
        await this.notificationService.notifyNewComment(
            body.userId,
            body.reportId,
            body.reportTitle,
            body.commenterName
        );
        return { message: 'Notificación de nuevo comentario enviada' };
    }

    @Post('internal/report-trending')
    async notifyReportTrending(@Body() body: {
        userId: number;
        reportId: number;
        reportTitle: string;
        voteCount: number;
    }): Promise<{ message: string }> {
        await this.notificationService.notifyReportTrending(
            body.userId,
            body.reportId,
            body.reportTitle,
            body.voteCount
        );
        return { message: 'Notificación de reporte trending enviada' };
    }
}