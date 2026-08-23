USE SalaTrack;
GO

CREATE TRIGGER trg_historial_solicitud
ON SolicitudPermiso
AFTER UPDATE
AS
BEGIN
    INSERT INTO HistorialSolicitud (solicitud_id, estado_anterior, estado_nuevo, fecha_cambio)
    SELECT
        i.solicitud_id,
        d.estado,
        i.estado,
        GETDATE()
    FROM inserted i
    JOIN deleted d ON i.solicitud_id = d.solicitud_id
    WHERE i.estado <> d.estado;
END;
GO