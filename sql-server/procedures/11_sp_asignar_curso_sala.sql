USE SalaTrack;
GO

IF OBJECT_ID('sp_asignar_curso_sala', 'P') IS NOT NULL
    DROP PROCEDURE sp_asignar_curso_sala;
GO

CREATE PROCEDURE sp_asignar_curso_sala
    @sala_id         INT,
    @curso_id        INT,
    @semestre        NVARCHAR(10),
    @dia_semana      NVARCHAR(15),
    @hora_inicio     TIME,
    @hora_fin        TIME,
    @perfil_permisos NVARCHAR(50),
    @asignacion_id   INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (SELECT 1 FROM Sala WHERE sala_id = @sala_id)
            THROW 50001, 'La sala indicada no existe.', 1;

        IF NOT EXISTS (SELECT 1 FROM Curso WHERE curso_id = @curso_id)
            THROW 50002, 'El curso indicado no existe.', 1;

        IF EXISTS (SELECT 1 FROM Sala WHERE sala_id = @sala_id AND estado = 'fuera de servicio')
            THROW 50003, 'La sala esta fuera de servicio y no admite asignaciones.', 1;

        IF NOT EXISTS (
            SELECT 1 FROM Equipo
            WHERE sala_id = @sala_id AND estado = 'disponible'
        )
            THROW 50004, 'La sala no tiene equipos disponibles.', 1;

        INSERT INTO AsignacionSemestral
            (sala_id, curso_id, semestre, dia_semana, hora_inicio, hora_fin, perfil_permisos, estado)
        VALUES
            (@sala_id, @curso_id, @semestre, @dia_semana, @hora_inicio, @hora_fin, @perfil_permisos, 'asignada');

        SET @asignacion_id = SCOPE_IDENTITY();

        DECLARE @equipos_disponibles INT;
        SELECT @equipos_disponibles = COUNT(*)
        FROM Equipo
        WHERE sala_id = @sala_id AND estado = 'disponible';

        INSERT INTO RequisitoPendiente (asignacion_id, requisito_curso_id, motivo, detalle)
        SELECT
            @asignacion_id,
            rc.requisito_curso_id,
            CASE
                WHEN rc.software_id IS NULL THEN 'configuracion no verificable'
                WHEN cob.equipos_con_software = 0 THEN 'software no instalado'
                WHEN cob.equipos_con_permiso < @equipos_disponibles THEN 'permisos insuficientes'
                ELSE 'software no instalado'
            END,
            CASE
                WHEN rc.software_id IS NULL
                    THEN 'Configuracion manual: ' + ISNULL(rc.descripcion_configuracion, '(sin descripcion)')
                ELSE 'Software: ' + s.nombre
                     + ' | Equipos disponibles: ' + CAST(@equipos_disponibles AS NVARCHAR(10))
                     + ' | Con software: ' + CAST(cob.equipos_con_software AS NVARCHAR(10))
                     + ' | Con permiso requerido: ' + CAST(cob.equipos_con_permiso AS NVARCHAR(10))
            END
        FROM RequisitoCurso rc
        LEFT JOIN Software s ON s.software_id = rc.software_id
        OUTER APPLY (
            SELECT
                (
                    SELECT COUNT(*)
                    FROM Equipo e
                    INNER JOIN EquipoSoftware es
                            ON es.equipo_id = e.equipo_id
                           AND es.software_id = rc.software_id
                    WHERE e.sala_id = @sala_id
                      AND e.estado = 'disponible'
                ) AS equipos_con_software,
                (
                    SELECT COUNT(*)
                    FROM Equipo e
                    INNER JOIN EquipoSoftware es
                            ON es.equipo_id = e.equipo_id
                           AND es.software_id = rc.software_id
                    WHERE e.sala_id = @sala_id
                      AND e.estado = 'disponible'
                      AND es.nivel_permisos = rc.nivel_permiso_necesario
                ) AS equipos_con_permiso
        ) cob
        WHERE rc.curso_id = @curso_id
          AND (
                rc.software_id IS NULL
                OR ISNULL(cob.equipos_con_permiso, 0) < @equipos_disponibles
              );

        IF EXISTS (
            SELECT 1 FROM RequisitoPendiente
            WHERE asignacion_id = @asignacion_id
              AND estado = 'pendiente'
        )
        BEGIN
            UPDATE AsignacionSemestral
            SET estado = 'asignada con requisitos pendientes'
            WHERE asignacion_id = @asignacion_id;
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SET @asignacion_id = NULL;
        THROW;
    END CATCH
END;
GO

PRINT 'Procedimiento sp_asignar_curso_sala creado correctamente';
GO