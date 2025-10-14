import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { NotificationRepository, Notification } from "./notification.repository";
import { NotificationDto } from "./dto/notification.dto";

// Constantes para los tipos de notificación
export const NOTIFICATION_TYPES = {
    REPORT_STATUS_CHANGE: 1,
    NEW_COMMENT_ON_REPORT: 2,
    REPORT_TRENDING: 3,
    SYSTEM_ANNOUNCEMENT: 4,
    ADMIN_MESSAGE: 5
} as const;

@Injectable()
export class NotificationService {
    constructor(private readonly notificationRepository: NotificationRepository) {}

    // ===== CREAR NOTIFICACIONES =====

    async createNotification(
        userId: number,
        title: string,
        message: string,
        relatedId?: number
    ): Promise<void> {
        if (!userId || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        if (!title || title.trim() === "") {
            throw new BadRequestException("Título es requerido");
        }

        if (!message || message.trim() === "") {
            throw new BadRequestException("Mensaje es requerido");
        }

        await this.notificationRepository.createNotification(
            userId, 
            title.trim(), 
            message.trim(), 
            relatedId
        );
    }

    // ===== MÉTODOS HELPER PARA CREAR NOTIFICACIONES ESPECÍFICAS =====

    async notifyReportStatusChange(
        userId: number, 
        reportId: number, 
        reportTitle: string, 
        newStatus: string
    ): Promise<void> {
        const statusEmojis: Record<string, string> = {
            'pending': '⏳',
            'in_progress': '🔍',
            'approved': '✅',
            'rejected': '❌'
        };

        const emoji = statusEmojis[newStatus] || '📊';
        
        await this.createNotification(
            userId,
            `${emoji} Estado de reporte actualizado`,
            `Tu reporte "${reportTitle}" ahora está: ${newStatus}`,
            reportId
        );
    }

    private mapNotificationToDto(n: Notification): NotificationDto {
        return {
            id: n.id,
            userId: n.user_id,
            title: n.title,
            message: n.message,
            relatedId: n.related_id ?? undefined,
            isRead: n.is_read,
            createdAt: new Date(n.created_at).toISOString(),
            updatedAt: new Date(n.updated_at).toISOString(),
        };
    }

    async getNotificationsByUserId(userId: number, limit: number = 50, offset: number = 0): Promise<NotificationDto[]> {
        if (!userId || userId <= 0) throw new BadRequestException("ID de usuario inválido");
        const rows = await this.notificationRepository.findNotificationsByUserId(userId, limit, offset);
        return rows.map(r => this.mapNotificationToDto(r));
    }

    async getUnreadNotificationsByUserId(userId: number): Promise<NotificationDto[]> {
        if (!userId || userId <= 0) throw new BadRequestException("ID de usuario inválido");
        const rows = await this.notificationRepository.findUnreadNotificationsByUserId(userId);
        return rows.map(r => this.mapNotificationToDto(r));
    }

    async getUnreadCountByUserId(userId: number): Promise<number> {
        if (!userId || userId <= 0) throw new BadRequestException("ID de usuario inválido");
        return this.notificationRepository.getUnreadCountByUserId(userId);
    }

    async getNotificationById(id: number): Promise<NotificationDto> {
        if (!id || id <= 0) throw new BadRequestException("ID de notificación inválido");
        const n = await this.notificationRepository.findById(id);
        if (!n) throw new NotFoundException("Notificación no encontrada");
        return this.mapNotificationToDto(n);
    }
}