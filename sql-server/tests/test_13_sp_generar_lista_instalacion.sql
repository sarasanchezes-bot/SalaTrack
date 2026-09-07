USE SalaTrack;
GO

PRINT '--- PRUEBA 1: Generación de lista para Sala 2 (Requisitos pendientes) ---';

BEGIN TRY
    EXEC dbo.sp_generar_lista_instalacion @sala_id = 2, @usuario_id = 1;
    PRINT 'SUCCESS: Prueba 1 ejecutada correctamente.';
END TRY
BEGIN CATCH
    PRINT 'FAIL: Error inesperado en Prueba 1 -> ' + ERROR_MESSAGE();
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

PRINT '--- PRUEBA 3: Llamada con transacción previa activa (SAVE TRANSACTION) ---';

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