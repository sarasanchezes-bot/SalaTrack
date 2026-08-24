CREATE TABLE HistorialSolicitud (
    historial_id     INT IDENTITY(1,1) PRIMARY KEY,
    solicitud_id      INT NOT NULL,
    estado_anterior   NVARCHAR(20) NOT NULL,
    estado_nuevo      NVARCHAR(20) NOT NULL,
    fecha_cambio      DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_HistorialSolicitud_Solicitud FOREIGN KEY (solicitud_id) REFERENCES SolicitudPermiso(solicitud_id)
);