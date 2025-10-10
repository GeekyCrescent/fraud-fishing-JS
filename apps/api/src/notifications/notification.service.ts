import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { NotificationRepository } from "./notification.repository";

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
}