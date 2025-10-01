import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { 
    NotificationRepository, 
    NotificationWithType, 
    NotificationType, 
    UserNotificationPreference 
} from "./notification.repository";

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
        typeId: number,
        title: string,
        message: string,
        relatedId?: number
    ): Promise<void> {
        if (!userId || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        if (!typeId || typeId <= 0) {
            throw new BadRequestException("ID de tipo de notificación inválido");
        }

        if (!title || title.trim() === "") {
            throw new BadRequestException("Título es requerido");
        }

        if (!message || message.trim() === "") {
            throw new BadRequestException("Mensaje es requerido");
        }

        // Validar que el tipo de notificación existe
        const notificationType = await this.notificationRepository.findNotificationTypeById(typeId);
        if (!notificationType || !notificationType.is_active) {
            throw new BadRequestException("Tipo de notificación inválido o inactivo");
        }

        // Verificar si el usuario quiere recibir este tipo de notificación
        const preferences = await this.notificationRepository.userWantsNotificationType(userId, typeId);
        
        if (!preferences.enabled) {
            // Usuario no quiere este tipo de notificación, no crear
            return;
        }

        await this.notificationRepository.createNotification(
            userId, 
            typeId, 
            title.trim(), 
            message.trim(), 
            relatedId
        );
    }

    async createBulkNotifications(notifications: Array<{
        userId: number;
        typeId: number;
        title: string;
        message: string;
        relatedId?: number;
    }>): Promise<void> {
        if (!notifications || notifications.length === 0) return;

        // Validar cada notificación y filtrar las que los usuarios quieren recibir
        const validNotifications: Array<{
            userId: number;
            notificationTypeId: number;
            title: string;
            message: string;
            relatedId?: number;
        }> = [];

        for (const notif of notifications) {
            // Validaciones básicas
            if (!notif.userId || notif.userId <= 0) continue;
            if (!notif.typeId || notif.typeId <= 0) continue;
            if (!notif.title || notif.title.trim() === "") continue;
            if (!notif.message || notif.message.trim() === "") continue;

            // Verificar preferencias del usuario
            const preferences = await this.notificationRepository.userWantsNotificationType(
                notif.userId, 
                notif.typeId
            );
            
            if (preferences.enabled) {
                validNotifications.push({
                    userId: notif.userId,
                    notificationTypeId: notif.typeId,
                    title: notif.title.trim(),
                    message: notif.message.trim(),
                    relatedId: notif.relatedId
                });
            }
        }

        if (validNotifications.length > 0) {
            await this.notificationRepository.createBulkNotifications(validNotifications);
        }
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
            NOTIFICATION_TYPES.REPORT_STATUS_CHANGE,
            `${emoji} Estado de reporte actualizado`,
            `Tu reporte "${reportTitle}" ahora está: ${newStatus}`,
            reportId
        );
    }

    async notifyNewComment(
        userId: number, 
        reportId: number, 
        reportTitle: string, 
        commenterName: string
    ): Promise<void> {
        await this.createNotification(
            userId,
            NOTIFICATION_TYPES.NEW_COMMENT_ON_REPORT,
            `💬 Nuevo comentario`,
            `${commenterName} ha comentado en tu reporte "${reportTitle}"`,
            reportId
        );
    }

    async notifyReportTrending(
        userId: number, 
        reportId: number, 
        reportTitle: string, 
        voteCount: number
    ): Promise<void> {
        await this.createNotification(
            userId,
            NOTIFICATION_TYPES.REPORT_TRENDING,
            `🚨 Reporte popular`,
            `Tu reporte "${reportTitle}" ha recibido ${voteCount} votos de la comunidad`,
            reportId
        );
    }

    async sendSystemAnnouncement(
        title: string, 
        message: string, 
        userIds: number[]
    ): Promise<void> {
        if (!userIds || userIds.length === 0) {
            throw new BadRequestException("Debe especificar al menos un usuario para el anuncio");
        }

        const notifications = userIds.map(userId => ({
            userId,
            typeId: NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT,
            title: `📢 ${title}`,
            message
        }));
        
        await this.createBulkNotifications(notifications);
    }

    async sendAdminMessage(
        userId: number, 
        title: string, 
        message: string, 
        relatedId?: number
    ): Promise<void> {
        await this.createNotification(
            userId,
            NOTIFICATION_TYPES.ADMIN_MESSAGE,
            `👑 ${title}`,
            message,
            relatedId
        );
    }

    // ===== OBTENER NOTIFICACIONES =====

    async getNotificationsByUserId(
        userId: number, 
        limit: number = 50, 
        offset: number = 0
    ): Promise<NotificationWithType[]> {
        if (!userId || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        if (limit < 0 || limit > 100) {
            throw new BadRequestException("Límite debe estar entre 0 y 100");
        }

        if (offset < 0) {
            throw new BadRequestException("Offset no puede ser negativo");
        }

        return this.notificationRepository.findNotificationsByUserId(userId, limit, offset);
    }

    async getUnreadNotificationsByUserId(userId: number): Promise<NotificationWithType[]> {
        if (!userId || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        return this.notificationRepository.findUnreadNotificationsByUserId(userId);
    }

    async getUnreadCountByUserId(userId: number): Promise<number> {
        if (!userId || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        return this.notificationRepository.getUnreadCountByUserId(userId);
    }

    async getNotificationById(id: number): Promise<NotificationWithType> {
        if (!id || id <= 0) {
            throw new BadRequestException("ID de notificación inválido");
        }

        const notification = await this.notificationRepository.findById(id);
        if (!notification) {
            throw new NotFoundException("Notificación no encontrada");
        }

        return notification;
    }

    // ===== MARCAR COMO LEÍDO/NO LEÍDO =====

    async markAsRead(id: number, userId: number): Promise<void> {
        const notification = await this.getNotificationById(id);
        
        // Verificar que la notificación pertenece al usuario
        if (notification.user_id !== userId) {
            throw new BadRequestException("No tienes permiso para modificar esta notificación");
        }

        await this.notificationRepository.markAsRead(id);
    }

    async markAsUnread(id: number, userId: number): Promise<void> {
        const notification = await this.getNotificationById(id);
        
        // Verificar que la notificación pertenece al usuario
        if (notification.user_id !== userId) {
            throw new BadRequestException("No tienes permiso para modificar esta notificación");
        }

        await this.notificationRepository.markAsUnread(id);
    }

    async markAllAsReadByUserId(userId: number): Promise<void> {
        if (!userId || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        await this.notificationRepository.markAllAsReadByUserId(userId);
    }

    // ===== GESTIÓN DE TIPOS DE NOTIFICACIÓN =====

    async getNotificationTypes(): Promise<NotificationType[]> {
        return this.notificationRepository.findAllNotificationTypes();
    }

    async getNotificationTypeById(id: number): Promise<NotificationType> {
        if (!id || id <= 0) {
            throw new BadRequestException("ID de tipo de notificación inválido");
        }

        const type = await this.notificationRepository.findNotificationTypeById(id);
        if (!type) {
            throw new NotFoundException("Tipo de notificación no encontrado");
        }

        return type;
    }

    async getNotificationTypeByName(name: string): Promise<NotificationType> {
        if (!name || name.trim() === "") {
            throw new BadRequestException("Nombre de tipo de notificación requerido");
        }

        const type = await this.notificationRepository.findNotificationTypeByName(name.trim());
        if (!type) {
            throw new NotFoundException("Tipo de notificación no encontrado");
        }

        return type;
    }

    // ===== GESTIÓN DE PREFERENCIAS =====

    async getUserPreferences(userId: number): Promise<UserNotificationPreference[]> {
        if (!userId || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        return this.notificationRepository.findPreferencesByUserId(userId);
    }

    async updateUserPreference(
        userId: number,
        typeId: number,
        enabled: boolean = true,
        emailEnabled: boolean = true,
        pushEnabled: boolean = true
    ): Promise<void> {
        if (!userId || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        if (!typeId || typeId <= 0) {
            throw new BadRequestException("ID de tipo de notificación inválido");
        }

        // Validar que el tipo existe
        const type = await this.notificationRepository.findNotificationTypeById(typeId);
        if (!type || !type.is_active) {
            throw new BadRequestException("Tipo de notificación inválido o inactivo");
        }

        await this.notificationRepository.setUserNotificationPreference(
            userId, typeId, enabled, emailEnabled, pushEnabled
        );
    }

    async updateAllUserPreferences(userId: number, preferences: Array<{
        typeId: number;
        enabled: boolean;
        emailEnabled: boolean;
        pushEnabled: boolean;
    }>): Promise<void> {
        if (!userId || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        if (!preferences || preferences.length === 0) {
            throw new BadRequestException("Debe proporcionar al menos una preferencia");
        }

        // Validar cada preferencia
        for (const pref of preferences) {
            if (!pref.typeId || pref.typeId <= 0) {
                throw new BadRequestException(`ID de tipo de notificación inválido: ${pref.typeId}`);
            }

            // Verificar que el tipo existe
            const type = await this.notificationRepository.findNotificationTypeById(pref.typeId);
            if (!type || !type.is_active) {
                throw new BadRequestException(`Tipo de notificación inválido o inactivo: ${pref.typeId}`);
            }
        }

        await this.notificationRepository.updateAllUserPreferences(userId, preferences);
    }

    async createDefaultPreferencesForUser(userId: number): Promise<void> {
        if (!userId || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        await this.notificationRepository.createDefaultPreferences(userId);
    }

    async getUserWantsNotificationType(userId: number, typeId: number): Promise<{
        enabled: boolean;
        emailEnabled: boolean;
        pushEnabled: boolean;
    }> {
        if (!userId || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        if (!typeId || typeId <= 0) {
            throw new BadRequestException("ID de tipo de notificación inválido");
        }

        return this.notificationRepository.userWantsNotificationType(userId, typeId);
    }

    // ===== ADMINISTRACIÓN =====

    async deleteOldNotifications(days: number = 30): Promise<void> {
        if (days < 1) {
            throw new BadRequestException("El número de días debe ser mayor a 0");
        }

        await this.notificationRepository.deleteOldNotifications(days);
    }

    async deleteAllUserNotifications(userId: number): Promise<void> {
        if (!userId || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        await this.notificationRepository.deleteAllByUserId(userId);
    }

    // ===== VALIDACIONES HELPER =====

    private validateNotificationData(title: string, message: string): void {
        if (!title || title.trim() === "") {
            throw new BadRequestException("Título es requerido");
        }

        if (title.trim().length > 255) {
            throw new BadRequestException("Título no puede exceder 255 caracteres");
        }

        if (!message || message.trim() === "") {
            throw new BadRequestException("Mensaje es requerido");
        }

        if (message.trim().length > 1000) {
            throw new BadRequestException("Mensaje no puede exceder 1000 caracteres");
        }
    }

    // ===== MÉTODOS DE UTILIDAD =====

    async getNotificationSummary(userId: number): Promise<{
        total: number;
        unread: number;
        recent: NotificationWithType[];
    }> {
        if (!userId || userId <= 0) {
            throw new BadRequestException("ID de usuario inválido");
        }

        const [total, unread, recent] = await Promise.all([
            this.notificationRepository.findNotificationsByUserId(userId, 1000, 0),
            this.getUnreadCountByUserId(userId),
            this.notificationRepository.findNotificationsByUserId(userId, 5, 0)
        ]);

        return {
            total: total.length,
            unread,
            recent
        };
    }

    async hasUnreadNotifications(userId: number): Promise<boolean> {
        const count = await this.getUnreadCountByUserId(userId);
        return count > 0;
    }
}