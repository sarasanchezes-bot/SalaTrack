
-- SalaTrack: Demo de la Unidad 1 que desarrollamos
-- Antes que nada, usemos el script maestro que hizo sara antes de usar la demo

USE SalaTrack;
GO

-- Apertura: Nuestro Problema, alcance y diagrama ER
-- (Mostremos el README.md y docs/diagramas/salatrack_er.png)



-- Primera parte (Pedro): Modelo, normalizacion y vistas
-- Normalizacion: ver docs/normalizacion.md

PRINT 'Primera parte: Vistas ';

SELECT * FROM vw_verificacion_compatibilidad;
GO

SELECT * FROM vw_lista_instalacion;
GO

SELECT * FROM vw_requisitos_por_curso ORDER BY curso_id, categoria;
GO

-- Funcion de tabla: requisitos que le faltan a una sala puntual
SELECT * FROM fn_requisitos_pendientes_sala(2);
GO


-- Segunda parte (Juan): Procedimientos con transaccion
-- un caso que hace COMMIT y otro que fuerza ROLLBACK

PRINT 'Segunda parte 2.0: sp_asignar_curso_sala (XACT_ABORT ON / THROW) ';

PRINT 'COMMIT: asignacion valida';
DECLARE @id_asig INT;
DECLARE @sala_demo INT = (SELECT MIN(sala_id) FROM Sala WHERE estado = 'disponible');
DECLARE @curso_demo INT = (SELECT MIN(curso_id) FROM Curso);

EXEC sp_asignar_curso_sala
    @sala_id = @sala_demo, @curso_id = @curso_demo, @semestre = '2026-2',
    @dia_semana = 'Viernes', @hora_inicio = '07:00', @hora_fin = '09:00',
    @perfil_permisos = 'estandar', @asignacion_id = @id_asig OUTPUT;

PRINT 'Asignacion creada con id: ' + CAST(@id_asig AS NVARCHAR(10));
SELECT * FROM AsignacionSemestral WHERE asignacion_id = @id_asig;
GO

PRINT 'ROLLBACK: sala inexistente';
DECLARE @filas_antes INT = (SELECT COUNT(*) FROM AsignacionSemestral);
DECLARE @id_fallido INT;

BEGIN TRY
    EXEC sp_asignar_curso_sala
        @sala_id = 99999, @curso_id = 1, @semestre = '2026-2',
        @dia_semana = 'Sabado', @hora_inicio = '07:00', @hora_fin = '09:00',
        @perfil_permisos = 'estandar', @asignacion_id = @id_fallido OUTPUT;
END TRY
BEGIN CATCH
    PRINT 'Error capturado: ' + ERROR_MESSAGE();
END CATCH

DECLARE @filas_despues INT = (SELECT COUNT(*) FROM AsignacionSemestral);
PRINT CASE WHEN @filas_antes = @filas_despues
    THEN 'ROLLBACK CORRECTO: no se inserto nada'
    ELSE 'FALLO: quedaron datos' END;
GO


PRINT 'Segunda parte 2.1: sp_registrar_solicitud_permiso (XACT_ABORT ON)';

PRINT 'COMMIT: solicitud valida';
EXEC sp_registrar_solicitud_permiso
    @curso_id = 2,
    @software_solicitado = 'Unity',
    @justificacion = 'Demo en vivo, sustentacion Unidad 1';

SELECT TOP 1 * FROM SolicitudPermiso ORDER BY solicitud_id DESC;
GO

PRINT 'ROLLBACK: curso inexistente';
BEGIN TRY
    EXEC sp_registrar_solicitud_permiso
        @curso_id = 999,
        @software_solicitado = 'Test',
        @justificacion = 'Prueba de rollback en vivo';
END TRY
BEGIN CATCH
    PRINT 'Error capturado: ' + ERROR_MESSAGE();
END CATCH
GO


PRINT 'Segunda parte 2.2: sp_registrar_mantenimiento (SAVE TRANSACTION)';

PRINT 'COMMIT: mantenimiento valido, cierra incidencia abierta';
INSERT INTO Incidencia (equipo_id, descripcion, estado)
VALUES (4, 'Teclado no responde', 'abierta');

EXEC sp_registrar_mantenimiento
    @equipo_id = 4, @tecnico_id = 2,
    @tipo_mantenimiento = 'Correctivo',
    @descripcion = 'Demo en vivo, sustentacion Unidad 1',
    @costo = 25000.00;

SELECT estado FROM Equipo WHERE equipo_id = 4;
SELECT * FROM Incidencia WHERE equipo_id = 4;
GO

PRINT 'ROLLBACK: equipo inexistente';
DECLARE @mant_antes INT = (SELECT COUNT(*) FROM Mantenimiento);

BEGIN TRY
    EXEC sp_registrar_mantenimiento
        @equipo_id = 999, @tecnico_id = 1,
        @tipo_mantenimiento = 'Preventivo',
        @descripcion = 'Prueba de rollback en vivo',
        @costo = 10000.00;
END TRY
BEGIN CATCH
    PRINT 'Error capturado: ' + ERROR_MESSAGE();
END CATCH

DECLARE @mant_despues INT = (SELECT COUNT(*) FROM Mantenimiento);
PRINT CASE WHEN @mant_antes = @mant_despues
    THEN 'ROLLBACK CORRECTO: no se inserto nada'
    ELSE 'FALLO: quedo un mantenimiento huerfano' END;
GO


PRINT 'Segunda parte 2.3: sp_generar_lista_instalacion (@@TRANCOUNT)';

PRINT 'COMMIT: sala con asignaciones activas';
EXEC sp_generar_lista_instalacion @sala_id = 2;
GO

PRINT 'ROLLBACK: sala inexistente';
BEGIN TRY
    EXEC sp_generar_lista_instalacion @sala_id = 99999;
END TRY
BEGIN CATCH
    PRINT 'Error capturado: ' + ERROR_MESSAGE();
END CATCH
GO


-- Tercera parte (Juan): Triggers

PRINT 'Tercera parte 3.0: trg_mantenimiento_actualiza_equipo';
PRINT 'El equipo 4 quedo en "en mantenimiento" sin ningun UPDATE manual.';
GO

PRINT 'Tercera parte 3.1: trg_historial_solicitud';
DECLARE @ultima_solicitud INT = (SELECT MAX(solicitud_id) FROM SolicitudPermiso);

UPDATE SolicitudPermiso SET estado = 'aprobada' WHERE solicitud_id = @ultima_solicitud;

SELECT * FROM HistorialSolicitud WHERE solicitud_id = @ultima_solicitud;
GO


-- Cuarta parte (Juan): Los CTEs

PRINT 'CTE ranking de salas por requisitos faltantes';

WITH FaltantesPorSala AS (
    SELECT sala, COUNT(*) AS total_faltantes
    FROM vw_verificacion_compatibilidad
    WHERE estado_requisito = 'FALTA'
    GROUP BY sala
)
SELECT sala, total_faltantes,
       RANK() OVER (ORDER BY total_faltantes DESC) AS prioridad_inversion
FROM FaltantesPorSala
ORDER BY prioridad_inversion;
GO

PRINT 'CTE recursiva: calendario de sesiones';

DECLARE @inicio_semestre DATE = '2026-08-03';
DECLARE @fin_semestre    DATE = '2026-11-14';

WITH CalendarioSesiones AS (
    SELECT a.asignacion_id, a.sala_id, a.curso_id, a.dia_semana, @inicio_semestre AS fecha_sesion
    FROM AsignacionSemestral a
    WHERE a.estado <> 'cancelada'
    UNION ALL
    SELECT c.asignacion_id, c.sala_id, c.curso_id, c.dia_semana, DATEADD(DAY, 1, c.fecha_sesion)
    FROM CalendarioSesiones c
    WHERE DATEADD(DAY, 1, c.fecha_sesion) <= @fin_semestre
)
SELECT asignacion_id, sala_id, curso_id, fecha_sesion
FROM CalendarioSesiones
WHERE dia_semana = CASE (DATEPART(WEEKDAY, fecha_sesion) + @@DATEFIRST - 2) % 7
        WHEN 0 THEN 'Lunes' WHEN 1 THEN 'Martes' WHEN 2 THEN 'Miercoles'
        WHEN 3 THEN 'Jueves' WHEN 4 THEN 'Viernes' WHEN 5 THEN 'Sabado' WHEN 6 THEN 'Domingo'
     END
ORDER BY sala_id, fecha_sesion
OPTION (MAXRECURSION 400);
GO

-- Mostrar la Metodologia de uso de IA (Sara)
-- (Mostrar docs/ia-log.md por favor)
