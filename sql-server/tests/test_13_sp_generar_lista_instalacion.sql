USE SalaTrack;
GO

PRINT '--- PRUEBA 1: Verificación de Inserción Real para Sala 2 (COUNT antes y después) ---';

DECLARE @CountAntes INT, @CountDespues INT;

SELECT @CountAntes = COUNT(*) 
FROM EquipoSoftware es
JOIN Equipo e ON e.equipo_id = es.equipo_id
WHERE e.sala_id = 2;

BEGIN TRY
    EXEC dbo.sp_generar_lista_instalacion @sala_id = 2, @usuario_id = 1;
    
    SELECT @CountDespues = COUNT(*) 
    FROM EquipoSoftware es
    JOIN Equipo e ON e.equipo_id = es.equipo_id
    WHERE e.sala_id = 2;

    PRINT 'Registros antes: ' + CAST(@CountAntes AS VARCHAR);
    PRINT 'Registros después: ' + CAST(@CountDespues AS VARCHAR);

    IF @CountDespues >= @CountAntes
        PRINT 'SUCCESS: Prueba 1 ejecutada con éxito y cambio validado.';
    ELSE
        PRINT 'FAIL: No se reflejaron modificaciones en la base de datos.';
END TRY
BEGIN CATCH
    PRINT 'FAIL: Error en Prueba 1 -> ' + ERROR_MESSAGE();
END CATCH;
GO

PRINT '--- PRUEBA 2: Error intencional por Sala Inexistente (sala_id = 99999) ---';

BEGIN TRY
    EXEC dbo.sp_generar_lista_instalacion @sala_id = 99999, @usuario_id = 1;
    PRINT 'FAIL: La Prueba 2 debió fallar por sala inexistente.';
END TRY
BEGIN CATCH
    PRINT 'SUCCESS: Error capturado correctamente -> ' + ERROR_MESSAGE();
END CATCH;
GO

PRINT '--- PRUEBA 3: Transacción Anidada y Manejo de SAVE TRANSACTION ---';

BEGIN TRANSACTION TransaccionExterna;
BEGIN TRY
    EXEC dbo.sp_generar_lista_instalacion @sala_id = 2, @usuario_id = 1;
    ROLLBACK TRANSACTION TransaccionExterna;
    PRINT 'SUCCESS: Prueba 3 completada con Rollback externo limpio.';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION TransaccionExterna;
    PRINT 'FAIL: Error en Prueba 3 -> ' + ERROR_MESSAGE();
END CATCH;
GO