USE SalaTrack;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Incidencia')
BEGIN
    CREATE TABLE Incidencia (
        incidencia_id INT IDENTITY(1,1) PRIMARY KEY,
        equipo_id     INT NOT NULL,
        descripcion   NVARCHAR(300) NOT NULL,
        fecha_reporte DATETIME NOT NULL DEFAULT GETDATE(),
        estado        NVARCHAR(20) NOT NULL DEFAULT 'abierta',
        fecha_cierre  DATETIME NULL,

        CONSTRAINT FK_Incidencia_Equipo FOREIGN KEY (equipo_id) REFERENCES Equipo(equipo_id),
        CONSTRAINT CK_Incidencia_estado CHECK (estado IN ('abierta', 'cerrada'))
    );
END;
GO

PRINT 'Tabla Incidencia creada correctamente';
GO
