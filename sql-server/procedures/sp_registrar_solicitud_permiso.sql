USE SalaTrack;
GO

CREATE OR ALTER PROCEDURE sp_registrar_solicitud_permiso
    @curso_id INT,
    @software_solicitado NVARCHAR(100),
    @justificacion NVARCHAR(300)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (SELECT 1 FROM Curso WHERE curso_id = @curso_id)
        BEGIN
            RAISERROR('El curso especificado no existe', 16, 1);
        END

        INSERT INTO SolicitudPermiso (curso_id, software_solicitado, justificacion, fecha_solicitud, estado)
        VALUES (@curso_id, @software_solicitado, @justificacion, GETDATE(), 'pendiente');

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

PRINT 'Procedimiento sp_registrar_solicitud_permiso creado correctamente';
GO
