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

