import { ApiProperty } from "@nestjs/swagger";

// ===== DTOs BÁSICOS =====

export class NotificationDto {
    @ApiProperty({ example: 1, description: "ID de la notificación" })
    id: number;

    @ApiProperty({ example: 2, description: "ID del usuario que recibe la notificación" })
    user_id: number;

    @ApiProperty({ example: 1, description: "ID del tipo de notificación" })
    notification_type_id: number;

    @ApiProperty({ example: "📊 Estado de reporte actualizado", description: "Título de la notificación" })
    title: string;

    @ApiProperty({ example: "Tu reporte ha sido aprobado", description: "Mensaje de la notificación" })
    message: string;

    @ApiProperty({ example: 5, description: "ID del recurso relacionado (opcional)", required: false })
    related_id?: number;

    @ApiProperty({ example: false, description: "Si la notificación ha sido leída" })
    is_read: boolean;

    @ApiProperty({ example: "2025-09-30T10:00:00Z", description: "Fecha de creación" })
    created_at: Date;

    @ApiProperty({ example: "2025-09-30T10:00:00Z", description: "Fecha de última actualización" })
    updated_at: Date;
}

export class NotificationWithTypeDto extends NotificationDto {
    @ApiProperty({ example: "REPORT_STATUS_CHANGE", description: "Nombre del tipo de notificación" })
    type_name: string;

    @ApiProperty({ example: "Cuando el estado de uno de tus reportes cambia", description: "Descripción del tipo" })
    type_description: string;
}

// ===== DTOs PARA CREAR NOTIFICACIONES (ADMIN) =====

export class CreateNotificationDto {
    @ApiProperty({ example: 2, description: "ID del usuario que recibirá la notificación" })
    userId: number;

    @ApiProperty({ example: 1, description: "ID del tipo de notificación" })
    typeId: number;

    @ApiProperty({ example: "📊 Estado actualizado", description: "Título de la notificación" })
    title: string;

    @ApiProperty({ example: "El estado de tu reporte ha cambiado", description: "Mensaje de la notificación" })
    message: string;

    @ApiProperty({ example: 5, description: "ID del recurso relacionado (opcional)", required: false })
    relatedId?: number;
}

export class BulkNotificationItemDto {
    @ApiProperty({ example: 2, description: "ID del usuario" })
    userId: number;

    @ApiProperty({ example: 1, description: "ID del tipo de notificación" })
    typeId: number;

    @ApiProperty({ example: "Título de notificación", description: "Título" })
    title: string;

    @ApiProperty({ example: "Mensaje de notificación", description: "Mensaje" })
    message: string;

    @ApiProperty({ example: 5, description: "ID relacionado (opcional)", required: false })
    relatedId?: number;
}

export class CreateBulkNotificationDto {
    @ApiProperty({ 
        type: [BulkNotificationItemDto], 
        description: "Array de notificaciones a crear",
        example: [
            {
                userId: 2,
                typeId: 1,
                title: "📊 Estado actualizado",
                message: "Tu reporte ha sido aprobado",
                relatedId: 5
            }
        ]
    })
    notifications: BulkNotificationItemDto[];
}

// ===== DTOs PARA ANUNCIOS Y MENSAJES =====

export class SendSystemAnnouncementDto {
    @ApiProperty({ example: "Mantenimiento programado", description: "Título del anuncio" })
    title: string;

    @ApiProperty({ example: "El sistema estará en mantenimiento el domingo", description: "Mensaje del anuncio" })
    message: string;

    @ApiProperty({ 
        example: [1, 2, 3], 
        description: "Array de IDs de usuarios que recibirán el anuncio",
        type: [Number]
    })
    userIds: number[];
}

export class SendAdminMessageDto {
    @ApiProperty({ example: 2, description: "ID del usuario que recibirá el mensaje" })
    userId: number;

    @ApiProperty({ example: "Mensaje importante", description: "Título del mensaje administrativo" })
    title: string;

    @ApiProperty({ example: "Este es un mensaje del administrador", description: "Contenido del mensaje" })
    message: string;

    @ApiProperty({ example: 5, description: "ID del recurso relacionado (opcional)", required: false })
    relatedId?: number;
}

// ===== DTOs PARA PREFERENCIAS =====

export class UpdatePreferenceDto {
    @ApiProperty({ example: 1, description: "ID del tipo de notificación" })
    typeId: number;

    @ApiProperty({ example: true, description: "Si el tipo de notificación está habilitado" })
    enabled: boolean;

    @ApiProperty({ example: true, description: "Si las notificaciones por email están habilitadas" })
    emailEnabled: boolean;

    @ApiProperty({ example: false, description: "Si las notificaciones push están habilitadas" })
    pushEnabled: boolean;
}

export class PreferenceItemDto {
    @ApiProperty({ example: 1, description: "ID del tipo de notificación" })
    typeId: number;

    @ApiProperty({ example: true, description: "Si el tipo está habilitado" })
    enabled: boolean;

    @ApiProperty({ example: true, description: "Si el email está habilitado" })
    emailEnabled: boolean;

    @ApiProperty({ example: false, description: "Si push está habilitado" })
    pushEnabled: boolean;
}

export class UpdateAllPreferencesDto {
    @ApiProperty({ 
        type: [PreferenceItemDto], 
        description: "Array de preferencias a actualizar",
        example: [
            {
                typeId: 1,
                enabled: true,
                emailEnabled: true,
                pushEnabled: false
            }
        ]
    })
    preferences: PreferenceItemDto[];
}

// ===== DTOs PARA RESPUESTAS =====

export class NotificationCountDto {
    @ApiProperty({ example: 5, description: "Número de notificaciones no leídas" })
    count: number;
}

export class NotificationSummaryDto {
    @ApiProperty({ example: 25, description: "Total de notificaciones" })
    total: number;

    @ApiProperty({ example: 5, description: "Notificaciones no leídas" })
    unread: number;

    @ApiProperty({ type: [NotificationWithTypeDto], description: "Notificaciones recientes" })
    recent: NotificationWithTypeDto[];
}

export class HasUnreadDto {
    @ApiProperty({ example: true, description: "Si tiene notificaciones no leídas" })
    hasUnread: boolean;
}

export class NotificationPreferenceCheckDto {
    @ApiProperty({ example: true, description: "Si las notificaciones están habilitadas" })
    enabled: boolean;

    @ApiProperty({ example: true, description: "Si el email está habilitado" })
    emailEnabled: boolean;

    @ApiProperty({ example: false, description: "Si push está habilitado" })
    pushEnabled: boolean;
}

// ===== DTOs PARA ENDPOINTS INTERNOS =====

export class ReportStatusChangeDto {
    @ApiProperty({ example: 2, description: "ID del usuario" })
    userId: number;

    @ApiProperty({ example: 5, description: "ID del reporte" })
    reportId: number;

    @ApiProperty({ example: "Phishing de banco falso", description: "Título del reporte" })
    reportTitle: string;

    @ApiProperty({ example: "approved", description: "Nuevo estado del reporte" })
    newStatus: string;
}

export class NewCommentDto {
    @ApiProperty({ example: 2, description: "ID del usuario propietario del reporte" })
    userId: number;

    @ApiProperty({ example: 5, description: "ID del reporte" })
    reportId: number;

    @ApiProperty({ example: "Phishing de banco falso", description: "Título del reporte" })
    reportTitle: string;

    @ApiProperty({ example: "Juan Pérez", description: "Nombre de quien comentó" })
    commenterName: string;
}

export class ReportTrendingDto {
    @ApiProperty({ example: 2, description: "ID del usuario propietario del reporte" })
    userId: number;

    @ApiProperty({ example: 5, description: "ID del reporte" })
    reportId: number;

    @ApiProperty({ example: "Phishing de banco falso", description: "Título del reporte" })
    reportTitle: string;

    @ApiProperty({ example: 10, description: "Número total de votos" })
    voteCount: number;
}

// ===== DTOs DE RESPUESTA GENÉRICOS =====

export class SuccessMessageDto {
    @ApiProperty({ example: "Operación completada exitosamente", description: "Mensaje de éxito" })
    message: string;
}

export class BulkOperationResponseDto extends SuccessMessageDto {
    @ApiProperty({ example: 5, description: "Número de elementos procesados" })
    created?: number;
    
    @ApiProperty({ example: 3, description: "Número de usuarios afectados" })
    sentTo?: number;
}

// ===== DTO PARA PREFERENCIAS DE USUARIO =====

export class UserNotificationPreferenceDto {
    @ApiProperty({ example: 1, description: "ID de la preferencia" })
    id: number;

    @ApiProperty({ example: 2, description: "ID del usuario" })
    user_id: number;

    @ApiProperty({ example: 1, description: "ID del tipo de notificación" })
    notification_type_id: number;

    @ApiProperty({ example: true, description: "Si el tipo de notificación está habilitado" })
    enabled: boolean;

    @ApiProperty({ example: true, description: "Si las notificaciones por email están habilitadas" })
    email_enabled: boolean;

    @ApiProperty({ example: false, description: "Si las notificaciones push están habilitadas" })
    push_enabled: boolean;

    @ApiProperty({ example: "2025-09-30T10:00:00Z", description: "Fecha de creación" })
    created_at: Date;

    @ApiProperty({ example: "2025-09-30T10:00:00Z", description: "Fecha de última actualización" })
    updated_at: Date;
}

// Si necesitas incluir información del tipo de notificación:
export class UserNotificationPreferenceWithTypeDto extends UserNotificationPreferenceDto {
    @ApiProperty({ example: "REPORT_STATUS_CHANGE", description: "Nombre del tipo de notificación" })
    type_name?: string;

    @ApiProperty({ example: "Cuando el estado de uno de tus reportes cambia", description: "Descripción del tipo" })
    type_description?: string;
}