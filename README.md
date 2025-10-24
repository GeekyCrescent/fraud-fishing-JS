Manual Técnico — Proyecto FraudFishing
1. Introducción
FraudFishing es una aplicación compuesta por un backend en NestJS y un frontend en React + TypeScript (Vite), con una base de datos MySQL 8.0.
Su objetivo es gestionar reportes y usuarios de forma segura, integrando autenticación JWT, panel de administración y visualización web.
________________________________________
2. Requisitos del sistema
Asegúrate de tener instaladas las siguientes herramientas antes de iniciar:
Requisito	Versión mínima	Descripción
Node.js	18.x	Entorno de ejecución de JavaScript
npm	9.x	Gestor de dependencias
MySQL	8.0.x	Motor de base de datos
Git	—	Control de versiones para clonar el repositorio
________________________________________
3. Clonación del repositorio
git clone <URL_DEL_REPOSITORIO>
cd fraudfishing
________________________________________
4. Configuración de la base de datos MySQL
1.	Inicia el servicio MySQL y accede con el usuario root:
2.	mysql -u root -p
3.	Ejecuta los siguientes comandos para crear la base de datos y el usuario de la aplicación:
4.	CREATE DATABASE IF NOT EXISTS fraudfishing CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
5.	CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED BY 'apppass';
6.	GRANT ALL PRIVILEGES ON fraudfishing.* TO 'appuser'@'%';
7.	FLUSH PRIVILEGES;
8.	Carga el seed inicial con datos de prueba:
9.	mysql -u appuser -papppass fraudfishing < database/seed.sql
Esto creará las tablas necesarias y poblará la base de datos con usuarios, reportes y configuraciones iniciales.
________________________________________
5. Backend — API NestJS
5.1. Instalación
Entra a la carpeta del backend:
cd apps/api
npm install
5.2. Iniciar el servidor
npm run start:dev
Esto iniciará el servidor en:
http://localhost:3000
La documentación Swagger estará disponible en:
http://localhost:3000/docs
________________________________________
6. Frontend — React + Vite + TypeScript
6.1. Instalación
Desde la raíz del proyecto:
cd apps/web
npm install
6.2. Configuración de conexión
El frontend está diseñado para conectarse automáticamente al backend local (http://localhost:3000).
No es necesario modificar variables de entorno.
Si deseas cambiar la URL manualmente, revisa el archivo de configuración o constantes dentro del proyecto (por ejemplo, src/config.ts o src/services/api.ts).
6.3. Ejecución del cliente
npm run dev
La aplicación estará disponible en:
http://localhost:5173
________________________________________
7. Estructura del proyecto
fraudfishing/
├── apps/
│   ├── api/                 # Backend NestJS
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/            # Frontend React + TypeScript + Vite
│       ├── src/
│       ├── public/
│       └── package.json
├── database/
│   ├── schema.sql           # Estructura de la base de datos
│   └── seed.sql             # Datos iniciales
└── README.md
________________________________________
8. Pruebas y validación
1.	Verificar conexión a MySQL:
2.	mysql -u appuser -papppass -e "USE fraudfishing; SHOW TABLES;"
3.	Verificar API:
Abre en el navegador:
4.	http://localhost:3000/docs
Allí podrás probar todos los endpoints (/auth, /users, /admin/user).
5.	Verificar cliente web:
Accede a:
6.	http://localhost:5173
________________________________________
9. Solución de problemas
Problema	Posible causa	Solución
ECONNREFUSED: 127.0.0.1:3306	MySQL no está activo	Inicia el servicio MySQL
Access denied for user 'appuser'	Usuario no creado o sin permisos	Ejecuta nuevamente los comandos de creación de usuario
npm ERR! al instalar	Versión antigua de Node/npm	Actualiza Node.js y vuelve a instalar dependencias
Swagger no carga	Backend no inició correctamente	Verifica el puerto 3000 o errores en consola
________________________________________
10. Créditos
•	Backend: NestJS, TypeScript
•	Frontend: React + Vite + TypeScript
•	Base de Datos: MySQL 8.0
•	Autenticación: JWT
•	Desarrollado por: Equipo FraudFishing
