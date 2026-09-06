USE SalaTrack;
GO
CREATE OR ALTER PROCEDURE sp_registrar_mantenimiento
    @equipo_id           INT,
    @tecnico_id          INT,
    @tipo_mantenimiento  VARCHAR(50),
    @descripcion         VARCHAR(255),
    @costo               DECIMAL(10,2) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        IF NOT EXISTS (SELECT 1 FROM Equipo WHERE equipo_id = @equipo_id)
        BEGIN
            RAISERROR('El equipo especificado no existe', 16, 1);
        END
        IF NOT EXISTS (SELECT 1 FROM Tecnico WHERE tecnico_id = @tecnico_id)
        BEGIN
            RAISERROR('El tecnico especificado no existe', 16, 1);
        END
        INSERT INTO Mantenimiento (equipo_id, tecnico_id, tipo_mantenimiento, descripcion, costo, estado)
        VALUES (@equipo_id, @tecnico_id, @tipo_mantenimiento, @descripcion, @costo, 'En Proceso');
        SAVE TRANSACTION CierreIncidencias;
        BEGIN TRY
            UPDATE Incidencia
            SET estado = 'cerrada', fecha_cierre = GETDATE()
            WHERE equipo_id = @equipo_id AND estado = 'abierta';
        END TRY
        BEGIN CATCH
            ROLLBACK TRANSACTION CierreIncidencias;
        END CATCH
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
PRINT 'Procedimiento sp_registrar_mantenimiento creado correctamente';
GO
