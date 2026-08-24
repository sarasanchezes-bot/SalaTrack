USE SalaTrack;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SolicitudPermiso')
BEGIN
    CREATE TABLE SolicitudPermiso (
        solicitud_id        INT IDENTITY(1,1) PRIMARY KEY,
        curso_id             INT NOT NULL,
        software_solicitado NVARCHAR(100) NOT NULL,
        justificacion        NVARCHAR(300) NOT NULL,
        fecha_solicitud      DATETIME NOT NULL DEFAULT GETDATE(),
        estado               NVARCHAR(20) NOT NULL DEFAULT 'pendiente',

        CONSTRAINT FK_SolicitudPermiso_Curso FOREIGN KEY (curso_id) REFERENCES Curso(curso_id),
        CONSTRAINT CK_SolicitudPermiso_estado CHECK (estado IN ('pendiente', 'aprobada', 'rechazada'))
    );
END;
GO

PRINT 'Tabla SolicitudPermiso creada correctamente';
GO
