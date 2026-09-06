USE SalaTrack;
GO

-- CASO 1: COMMIT — asignacion valida
PRINT '=== CASO 1: COMMIT ===';
GO

DECLARE @id INT;
DECLARE @sala INT = (SELECT MIN(sala_id) FROM Sala WHERE estado = 'disponible');
DECLARE @curso INT = (SELECT MIN(curso_id) FROM Curso);

EXEC sp_asignar_curso_sala
    @sala_id         = @sala,
    @curso_id        = @curso,
    @semestre        = '2026-2',
    @dia_semana      = 'martes',
    @hora_inicio     = '08:00',
    @hora_fin        = '10:00',
    @perfil_permisos = 'estandar',
    @asignacion_id   = @id OUTPUT;

PRINT 'Asignacion creada con id: ' + CAST(@id AS NVARCHAR(10));

SELECT asignacion_id, sala_id, curso_id, semestre, estado
FROM AsignacionSemestral
WHERE asignacion_id = @id;

SELECT rp.pendiente_id, rp.requisito_curso_id, rp.motivo, rp.detalle, rp.estado
FROM RequisitoPendiente rp
WHERE rp.asignacion_id = @id;
GO

-- ============================================================
-- CASO 2: ROLLBACK — sala inexistente
-- ============================================================
PRINT '=== CASO 2: ROLLBACK (sala inexistente) ===';
GO

DECLARE @filas_antes INT = (SELECT COUNT(*) FROM AsignacionSemestral);
DECLARE @id2 INT;
DECLARE @curso2 INT = (SELECT MIN(curso_id) FROM Curso);

BEGIN TRY
    EXEC sp_asignar_curso_sala
        @sala_id         = 99999,
        @curso_id        = @curso2,
        @semestre        = '2026-2',
        @dia_semana      = 'miercoles',
        @hora_inicio     = '10:00',
        @hora_fin        = '12:00',
        @perfil_permisos = 'estandar',
        @asignacion_id   = @id2 OUTPUT;
END TRY
BEGIN CATCH
    PRINT 'Error capturado: ' + ERROR_MESSAGE();
END CATCH

DECLARE @filas_despues INT = (SELECT COUNT(*) FROM AsignacionSemestral);

PRINT 'Filas antes: ' + CAST(@filas_antes AS NVARCHAR(10));
PRINT 'Filas despues: ' + CAST(@filas_despues AS NVARCHAR(10));

IF @filas_antes = @filas_despues
    PRINT 'ROLLBACK CORRECTO: no se inserto ninguna fila.';
ELSE
    PRINT 'FALLO: la transaccion dejo datos.';
GO

-- CASO 3: ROLLBACK — horario duplicado (viola UQ)
-- Falla DESPUES del INSERT, demuestra que se revierte

PRINT '=== CASO 3: ROLLBACK (horario duplicado) ===';
GO

DECLARE @pend_antes INT = (SELECT COUNT(*) FROM RequisitoPendiente);
DECLARE @asig_antes INT = (SELECT COUNT(*) FROM AsignacionSemestral);
DECLARE @id3 INT;
DECLARE @sala3 INT = (SELECT MIN(sala_id) FROM Sala WHERE estado = 'disponible');
DECLARE @curso3 INT = (SELECT MIN(curso_id) FROM Curso);

BEGIN TRY
    EXEC sp_asignar_curso_sala
        @sala_id         = @sala3,
        @curso_id        = @curso3,
        @semestre        = '2026-2',
        @dia_semana      = 'martes',
        @hora_inicio     = '08:00',
        @hora_fin        = '10:00',
        @perfil_permisos = 'estandar',
        @asignacion_id   = @id3 OUTPUT;
END TRY
BEGIN CATCH
    PRINT 'Error capturado: ' + ERROR_MESSAGE();
END CATCH

DECLARE @pend_despues INT = (SELECT COUNT(*) FROM RequisitoPendiente);
DECLARE @asig_despues INT = (SELECT COUNT(*) FROM AsignacionSemestral);

IF @asig_antes = @asig_despues AND @pend_antes = @pend_despues
    PRINT 'ROLLBACK CORRECTO: asignacion y pendientes revertidos.';
ELSE
    PRINT 'FALLO: quedaron datos huerfanos.';
GO