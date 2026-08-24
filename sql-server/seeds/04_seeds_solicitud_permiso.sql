USE SalaTrack;
GO

-- Solicitudes de permisos/software adicional hechas por docentes (Basados en el requisito funcional numero 10).
-- Algunos curso_id: 1=Base de Datos Avanzada, 2=Inteligencia Artificial, 3=Seguridad Informatica, 4=Arquitectura de Sistemas
INSERT INTO SolicitudPermiso (curso_id, software_solicitado, justificacion, fecha_solicitud, estado) VALUES
(1, 'SQL Server 2022 - permisos de administrador', 'Se necesita habilitar conexiones TCP en la sala asignada para las practicas de la unidad uno', '2026-08-10', 'aprobada'),
(2, 'Docker Desktop', 'Se requiere para contenerizar el proyecto final del curso', '2026-08-11', 'pendiente'),
(3, 'Anaconda (distribucion de Python)', 'Se necesitan librerias cientificas que no vienen en la instalacion base de Python', '2026-08-12', 'pendiente'),
(4, 'MongoDB Compass', 'La sala asignada actualmente no tiene el software instalado', '2026-08-13', 'rechazada');
GO

PRINT 'Seeds de SolicitudPermiso insertados correctamente';
GO
