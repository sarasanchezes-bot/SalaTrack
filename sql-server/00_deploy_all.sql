-- ============================================================
-- SalaTrack — Script maestro de despliegue (Unidad 1)
-- ============================================================
-- Reconstruye la base de datos completa desde cero, en orden de
-- dependencias. Pensado para que cualquiera pueda clonar el
-- repositorio y levantar el modelo relacional sin conocer el
-- orden de los archivos.
--
-- REQUISITO: ejecutar con SQLCMD mode activado.
--   VS Code  -> icono "Enable SQLCMD" en la barra del editor de consultas
--   sqlcmd   -> funciona por defecto
--
-- Ejecutar desde la carpeta sql-server/ (las rutas son relativas).
--
-- ADVERTENCIA: la seccion 0 borra la base de datos si ya existe.
-- ============================================================

-- ============================================================
-- 0) Reset de la base de datos
-- ============================================================
USE master;
GO

IF DB_ID('SalaTrack') IS NOT NULL
BEGIN
    -- Cierra conexiones abiertas antes de borrar (si no, el DROP se queda colgado)
    ALTER DATABASE SalaTrack SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE SalaTrack;
END;
GO

CREATE DATABASE SalaTrack;
GO

USE SalaTrack;
GO

PRINT '=== Base de datos SalaTrack creada ===';
GO

-- ============================================================
-- 1) Esquema (tablas y restricciones)
-- ============================================================
-- El orden respeta las llaves foraneas:
--   Sala <- Equipo <- EquipoSoftware
--   Curso <- RequisitoCurso <- AsignacionSemestral <- RequisitoPendiente
--   Tecnico <- Mantenimiento
--   SolicitudPermiso <- HistorialSolicitud
PRINT '=== 1/5 Esquema ===';
GO

:r schema/01_schema_nucleo_fisico.sql
:r schema/02_curso_requisitocurso_asignacionsemestral.sql
:r schema/03_fix_estado_asignacion.sql
:r schema/04_tecnico.sql
:r schema/05_mantenimiento.sql
:r schema/06_solicitud_permiso.sql
:r schema/07_historial_solicitud.sql
:r schema/08_requisito_pendiente.sql
:r schema/09_incidencia.sql

-- ============================================================
-- 2) Datos de prueba
-- ============================================================
-- Van ANTES de los triggers a proposito (ver seccion 5).
PRINT '=== 2/5 Datos de prueba ===';
GO

:r seeds/01_seeds_nucleo_fisico.sql
:r seeds/02_seeds_nucleo_academico.sql
:r seeds/03_seeds_mantenimiento.sql
:r seeds/04_seeds_solicitud_permiso.sql

-- ============================================================
-- 3) Vistas
-- ============================================================
-- vw_lista_instalacion se apoya en vw_verificacion_compatibilidad,
-- por eso esta ultima va primero.
PRINT '=== 3/5 Vistas ===';
GO

:r views/verificar_compatibilidad.sql
:r views/requisitos_por_curso.sql
:r views/lista_instalacion.sql

-- ============================================================
-- 4) Funciones y procedimientos almacenados
-- ============================================================
PRINT '=== 4/5 Funciones y procedimientos ===';
GO

:r functions/01_fn_requisitos_pendientes_sala.sql
:r procedures/11_sp_asignar_curso_sala.sql
:r procedures/12_sp_registrar_mantenimiento.sql
:r procedures/13_sp_generar_lista_instalacion.sql
:r procedures/sp_registrar_solicitud_permiso.sql

-- ============================================================
-- 5) Triggers
-- ============================================================
-- Se crean DE ULTIMO, despues de cargar los datos de prueba.
-- Motivo: trg_mantenimiento_actualiza_equipo es AFTER INSERT sobre
-- Mantenimiento y pone Equipo.estado = 'en mantenimiento'. Si el
-- trigger existiera al correr seeds/03_seeds_mantenimiento.sql, los
-- equipos 1 y 2 quedarian en mantenimiento y las vistas de
-- compatibilidad (que solo cuentan equipos disponibles) darian
-- resultados distintos a los que muestran los seeds. Creandolo al
-- final, la base queda siempre en el mismo estado conocido y el
-- trigger se demuestra en vivo con un INSERT nuevo.
PRINT '=== 5/5 Triggers ===';
GO

:r triggers/01_trg_mantenimiento_actualiza_equipo.sql
:r triggers/02_trg_historial_solicitud.sql

-- ============================================================
-- Verificacion final
-- ============================================================
PRINT '=== Despliegue terminado — inventario de objetos ===';
GO

SELECT 'Tablas' AS tipo_objeto, COUNT(*) AS cantidad FROM sys.tables
UNION ALL SELECT 'Vistas',          COUNT(*) FROM sys.views
UNION ALL SELECT 'Funciones',       COUNT(*) FROM sys.objects WHERE type IN ('FN','IF','TF')
UNION ALL SELECT 'Procedimientos',  COUNT(*) FROM sys.procedures
UNION ALL SELECT 'Triggers',        COUNT(*) FROM sys.triggers WHERE is_ms_shipped = 0;
GO

SELECT 'Sala' AS tabla, COUNT(*) AS filas FROM Sala
UNION ALL SELECT 'Equipo',              COUNT(*) FROM Equipo
UNION ALL SELECT 'Software',            COUNT(*) FROM Software
UNION ALL SELECT 'EquipoSoftware',      COUNT(*) FROM EquipoSoftware
UNION ALL SELECT 'Curso',               COUNT(*) FROM Curso
UNION ALL SELECT 'RequisitoCurso',      COUNT(*) FROM RequisitoCurso
UNION ALL SELECT 'AsignacionSemestral', COUNT(*) FROM AsignacionSemestral
UNION ALL SELECT 'Tecnico',             COUNT(*) FROM Tecnico
UNION ALL SELECT 'Mantenimiento',       COUNT(*) FROM Mantenimiento
UNION ALL SELECT 'SolicitudPermiso',    COUNT(*) FROM SolicitudPermiso;
GO
