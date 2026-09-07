USE SalaTrack;
GO

CREATE OR ALTER PROCEDURE dbo.sp_generar_lista_instalacion
    @sala_id INT,
    @usuario_id INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Sala WHERE sala_id = @sala_id)
    BEGIN
        RAISERROR('Error: La sala con ID %d no existe.', 16, 1, @sala_id);
        RETURN;
    END;

    IF NOT EXISTS (SELECT 1 FROM Equipo WHERE sala_id = @sala_id)
    BEGIN
        RAISERROR('Error: La sala ID %d no tiene equipos registrados.', 16, 1, @sala_id);
        RETURN;
    END;

    IF NOT EXISTS (
        SELECT 1 
        FROM AsignacionSemestral 
        WHERE sala_id = @sala_id AND estado <> 'cancelada'
    )
    BEGIN
        RAISERROR('Error: La sala ID %d no tiene asignaciones semestrales activas.', 16, 1, @sala_id);
        RETURN;
    END;

    DECLARE @tran_count_inicial INT = @@TRANCOUNT;

    IF @tran_count_inicial = 0
        BEGIN TRANSACTION;
    ELSE
        SAVE TRANSACTION SavePointGenerarLista;

    BEGIN TRY
        INSERT INTO EquipoSoftware (equipo_id, software_id, nivel_permisos)
        SELECT DISTINCT
            e.equipo_id,
            rc.software_id,
            COALESCE(rc.nivel_permiso_necesario, 'estandar') AS nivel_permisos
        FROM Equipo e
        JOIN AsignacionSemestral a ON a.sala_id = e.sala_id
        JOIN RequisitoCurso rc ON rc.curso_id = a.curso_id
        WHERE e.sala_id = @sala_id
          AND a.estado <> 'cancelada'
          AND rc.es_obligatorio = 1
          AND rc.software_id IS NOT NULL
          AND NOT EXISTS (
              SELECT 1 
              FROM EquipoSoftware es 
              WHERE es.equipo_id = e.equipo_id 
                AND es.software_id = rc.software_id
          );

        DECLARE @filas_insertadas INT = @@ROWCOUNT;

        IF @tran_count_inicial = 0
            COMMIT TRANSACTION;

        PRINT CONCAT('Lista de instalación generada exitosamente. Registros agregados: ', @filas_insertadas);

    END TRY
    BEGIN CATCH
        IF @tran_count_inicial = 0
        BEGIN
            IF @@TRANCOUNT > 0
                ROLLBACK TRANSACTION;
        END
        ELSE
        BEGIN
            IF @@TRANCOUNT > 0
                ROLLBACK TRANSACTION SavePointGenerarLista;
        END;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO