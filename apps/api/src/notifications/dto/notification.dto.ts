import { ApiProperty } from "@nestjs/swagger";

// ===== DTOs PARA ENDPOINTS INTERNOS =====

export class CreateNotificationDto {
    @ApiProperty({ example: 1, description: "ID del usuario que recibirá la notificación" })
    userId: number;

    @ApiProperty({ example: 101, description: "ID del reporte relacionado" })
    reportId: number;

    @ApiProperty({ example: "Reporte de fraude", description: "Título del reporte" })
    reportTitle: string;

    @ApiProperty({ example: "Aprobado", description: "Nuevo estado del reporte" })
    newStatus: string;
}

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

export class NotificationDto {
    @ApiProperty({ example: 1001, description: "ID de la notificación" })
    id: number;

    @ApiProperty({ example: 42, description: "ID del usuario que recibe la notificación" })
    userId: number;

    @ApiProperty({ example: "Estado de reporte actualizado", description: "Título de la notificación" })
    title: string;

    @ApiProperty({ example: "Tu reporte \"Phishing de banco\" ahora está: approved", description: "Mensaje de la notificación" })
    message: string;

    @ApiProperty({ example: 555, description: "ID relacionado (por ejemplo, el reporte)", required: false })
    relatedId?: number;

    @ApiProperty({ example: false, description: "Si la notificación fue leída" })
    isRead: boolean;

    @ApiProperty({ example: "2024-09-30T12:34:56.000Z", description: "Fecha de creación (ISO)" })
    createdAt: string;

    @ApiProperty({ example: "2024-09-30T12:35:56.000Z", description: "Fecha de actualización (ISO)" })
    updatedAt: string;
}

export class UnreadCountDto {
    @ApiProperty({ example: 3, description: "Cantidad de notificaciones no leídas" })
    count: number;
}

