USE SalaTrack;
GO

PRINT '--- CASO 1: mantenimiento valido, debe cerrar la incidencia abierta ---';

INSERT INTO Incidencia (equipo_id, descripcion, estado)
VALUES (3, 'Pantalla no enciende', 'abierta');

EXEC sp_registrar_mantenimiento
    @equipo_id = 3,
    @tecnico_id = 1,
    @tipo_mantenimiento = 'Correctivo',
    @descripcion = 'Revision de pantalla, prueba de test',
    @costo = 30000.00;

SELECT * FROM Mantenimiento WHERE equipo_id = 3 ORDER BY mantenimiento_id DESC;
SELECT estado FROM Equipo WHERE equipo_id = 3;
SELECT * FROM Incidencia WHERE equipo_id = 3;
GO

PRINT '--- CASO 2: equipo inexistente, debe fallar SIN insertar nada ---';

DECLARE @mantenimientos_antes INT = (SELECT COUNT(*) FROM Mantenimiento);

BEGIN TRY
    EXEC sp_registrar_mantenimiento
        @equipo_id = 999,
        @tecnico_id = 1,
        @tipo_mantenimiento = 'Preventivo',
        @descripcion = 'Prueba de rollback',
        @costo = 10000.00;
END TRY
BEGIN CATCH
    PRINT 'Error esperado: ' + ERROR_MESSAGE();
END CATCH

DECLARE @mantenimientos_despues INT = (SELECT COUNT(*) FROM Mantenimiento);

IF @mantenimientos_antes = @mantenimientos_despues
    PRINT 'OK: no se inserto ningun mantenimiento (rollback correcto)';
ELSE
    PRINT 'ERROR: se inserto un mantenimiento a pesar del error';
GO
