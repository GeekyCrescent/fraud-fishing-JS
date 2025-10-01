import { Injectable } from "@nestjs/common";
import { DbService } from "../db/db.service";

export type NotificationType = {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    created_at: Date;
}

export type Notification = {
    id: number;
    user_id: number;
    notification_type_id: number;
    title: string;
    message: string;
    related_id?: number;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
}

export type NotificationWithType = Notification & {
    type_name: string;
    type_description: string;
    user_email?: string;
    user_name?: string;
}

export type UserNotificationPreference = {
    id: number;
    user_id: number;
    notification_type_id: number;
    enabled: boolean;
    email_enabled: boolean;
    push_enabled: boolean;
    created_at: Date;
    updated_at: Date;
}

@Injectable()
export class NotificationRepository {
    constructor(private readonly dbService: DbService) {}

    // ===== MÉTODOS FALTANTES =====

    // 1. Métodos de NotificationType
    async findAllNotificationTypes(): Promise<NotificationType[]> {
        const sql = `SELECT * FROM notification_type WHERE is_active = true ORDER BY name`;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as NotificationType[];
    }

    async findNotificationTypeById(id: number): Promise<NotificationType> {
        const sql = `SELECT * FROM notification_type WHERE id = ? LIMIT 1`;
        const [rows] = await this.dbService.getPool().query(sql, [id]);
        const result = rows as NotificationType[];
        return result[0];
    }

    async findNotificationTypeByName(name: string): Promise<NotificationType> {
        const sql = `SELECT * FROM notification_type WHERE name = ? LIMIT 1`;
        const [rows] = await this.dbService.getPool().query(sql, [name]);
        const result = rows as NotificationType[];
        return result[0];
    }

    // 2. Métodos de Notification CRUD
    async createNotification(
        userId: number,
        notificationTypeId: number,
        title: string,
        message: string,
        relatedId?: number
    ): Promise<void> {
        const sql = `
            INSERT INTO notification (user_id, notification_type_id, title, message, related_id, is_read) 
            VALUES (?, ?, ?, ?, ?, false)
        `;
        await this.dbService.getPool().query(sql, [userId, notificationTypeId, title, message, relatedId || null]);
    }

    async createBulkNotifications(notifications: Array<{
        userId: number;
        notificationTypeId: number;
        title: string;
        message: string;
        relatedId?: number;
    }>): Promise<void> {
        if (notifications.length === 0) return;

        const sql = `
            INSERT INTO notification (user_id, notification_type_id, title, message, related_id, is_read) 
            VALUES ?
        `;
        
        const values = notifications.map(n => [
            n.userId, n.notificationTypeId, n.title, n.message, n.relatedId || null, false
        ]);
        
        await this.dbService.getPool().query(sql, [values]);
    }

    async findNotificationsByUserId(userId: number, limit: number = 50, offset: number = 0): Promise<NotificationWithType[]> {
        const sql = `
            SELECT n.*, nt.name as type_name, nt.description as type_description
            FROM notification n
            INNER JOIN notification_type nt ON n.notification_type_id = nt.id
            WHERE n.user_id = ? 
            ORDER BY n.created_at DESC 
            LIMIT ? OFFSET ?
        `;
        const [rows] = await this.dbService.getPool().query(sql, [userId, limit, offset]);
        return rows as NotificationWithType[];
    }

    async findUnreadNotificationsByUserId(userId: number): Promise<NotificationWithType[]> {
        const sql = `
            SELECT n.*, nt.name as type_name, nt.description as type_description
            FROM notification n
            INNER JOIN notification_type nt ON n.notification_type_id = nt.id
            WHERE n.user_id = ? AND n.is_read = false 
            ORDER BY n.created_at DESC
        `;
        const [rows] = await this.dbService.getPool().query(sql, [userId]);
        return rows as NotificationWithType[];
    }

    async getUnreadCountByUserId(userId: number): Promise<number> {
        const sql = `
            SELECT COUNT(*) as count 
            FROM notification 
            WHERE user_id = ? AND is_read = false
        `;
        const [rows] = await this.dbService.getPool().query(sql, [userId]);
        const result = rows as Array<{ count: number }>;
        return result[0]?.count || 0;
    }

    async findById(id: number): Promise<NotificationWithType> {
        const sql = `
            SELECT n.*, nt.name as type_name, nt.description as type_description
            FROM notification n
            INNER JOIN notification_type nt ON n.notification_type_id = nt.id
            WHERE n.id = ? 
            LIMIT 1
        `;
        const [rows] = await this.dbService.getPool().query(sql, [id]);
        const result = rows as NotificationWithType[];
        return result[0];
    }

    // 3. Métodos de actualización
    async markAsRead(id: number): Promise<void> {
        const sql = `
            UPDATE notification 
            SET is_read = true, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        await this.dbService.getPool().query(sql, [id]);
    }

    async markAsUnread(id: number): Promise<void> {
        const sql = `
            UPDATE notification 
            SET is_read = false, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        await this.dbService.getPool().query(sql, [id]);
    }

    async markAllAsReadByUserId(userId: number): Promise<void> {
        const sql = `
            UPDATE notification 
            SET is_read = true, updated_at = CURRENT_TIMESTAMP 
            WHERE user_id = ? AND is_read = false
        `;
        await this.dbService.getPool().query(sql, [userId]);
    }

    // 4. Métodos de preferencias de usuario
    async createDefaultPreferences(userId: number): Promise<void> {
        // Obtener todos los tipos de notificación activos
        const types = await this.findAllNotificationTypes();
        
        if (types.length === 0) return;

        const sql = `
            INSERT INTO user_notification_preference (user_id, notification_type_id, enabled, email_enabled, push_enabled)
            VALUES ?
        `;
        
        const values = types.map(type => [userId, type.id, true, true, true]);
        await this.dbService.getPool().query(sql, [values]);
    }

    async findPreferencesByUserId(userId: number): Promise<UserNotificationPreference[]> {
        const sql = `
            SELECT unp.*
            FROM user_notification_preference unp
            INNER JOIN notification_type nt ON unp.notification_type_id = nt.id
            WHERE unp.user_id = ? AND nt.is_active = true
            ORDER BY nt.name
        `;
        const [rows] = await this.dbService.getPool().query(sql, [userId]);
        return rows as UserNotificationPreference[];
    }

    async userWantsNotificationType(userId: number, typeId: number): Promise<{
        enabled: boolean;
        emailEnabled: boolean;
        pushEnabled: boolean;
    }> {
        const sql = `
            SELECT enabled, email_enabled, push_enabled 
            FROM user_notification_preference 
            WHERE user_id = ? AND notification_type_id = ?
        `;
        const [rows] = await this.dbService.getPool().query(sql, [userId, typeId]);
        const result = rows as Array<{ enabled: boolean; email_enabled: boolean; push_enabled: boolean }>;
        
        // Si no tiene preferencia configurada, asumir que SÍ quiere (default)
        return result.length === 0 
            ? { enabled: true, emailEnabled: true, pushEnabled: true }
            : { 
                enabled: result[0].enabled, 
                emailEnabled: result[0].email_enabled, 
                pushEnabled: result[0].push_enabled 
            };
    }

    async setUserNotificationPreference(
        userId: number,
        typeId: number,
        enabled: boolean = true,
        emailEnabled: boolean = true,
        pushEnabled: boolean = true
    ): Promise<void> {
        const sql = `
            INSERT INTO user_notification_preference (user_id, notification_type_id, enabled, email_enabled, push_enabled)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                enabled = VALUES(enabled),
                email_enabled = VALUES(email_enabled),
                push_enabled = VALUES(push_enabled),
                updated_at = CURRENT_TIMESTAMP
        `;
        await this.dbService.getPool().query(sql, [userId, typeId, enabled, emailEnabled, pushEnabled]);
    }

    async updateAllUserPreferences(userId: number, preferences: Array<{
        typeId: number;
        enabled: boolean;
        emailEnabled: boolean;
        pushEnabled: boolean;
    }>): Promise<void> {
        if (preferences.length === 0) return;

        // Usar transacción para asegurar atomicidad
        const connection = await this.dbService.getPool().getConnection();
        
        try {
            await connection.beginTransaction();

            for (const pref of preferences) {
                await connection.query(`
                    INSERT INTO user_notification_preference (user_id, notification_type_id, enabled, email_enabled, push_enabled)
                    VALUES (?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                        enabled = VALUES(enabled),
                        email_enabled = VALUES(email_enabled),
                        push_enabled = VALUES(push_enabled),
                        updated_at = CURRENT_TIMESTAMP
                `, [userId, pref.typeId, pref.enabled, pref.emailEnabled, pref.pushEnabled]);
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // 5. Métodos de eliminación
    async deleteOldNotifications(days: number = 30): Promise<void> {
        const sql = `
            DELETE FROM notification 
            WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
        `;
        await this.dbService.getPool().query(sql, [days]);
    }

    async deleteAllByUserId(userId: number): Promise<void> {
        const sql = `DELETE FROM notification WHERE user_id = ?`;
        await this.dbService.getPool().query(sql, [userId]);
    }
}