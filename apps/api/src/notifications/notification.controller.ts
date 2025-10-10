import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiResponse, ApiTags, ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";
import { CreateNotificationDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    // ===== ENDPOINTS INTERNOS PARA OTROS SERVICIOS =====

    @Post('internal/report-status-change')
    @ApiOperation({ summary: 'Notificar cambio de estado en un reporte' })
    @ApiBody({ type: CreateNotificationDto })
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
}