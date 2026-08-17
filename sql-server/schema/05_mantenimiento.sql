IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Mantenimiento')
BEGIN
    CREATE TABLE Mantenimiento (
        mantenimiento_id INT IDENTITY(1,1) PRIMARY KEY,
        equipo_id INT NOT NULL,
        tecnico_id INT NOT NULL,
        fecha_mantenimiento DATETIME DEFAULT GETDATE(),
        tipo_mantenimiento VARCHAR(50) CHECK (tipo_mantenimiento IN ('Preventivo', 'Correctivo')),
        descripcion VARCHAR(255) NOT NULL,
        costo DECIMAL(10,2) CHECK (costo >= 0),
        estado VARCHAR(50) DEFAULT 'En Proceso' CHECK (estado IN ('Pendiente', 'En Proceso', 'Completado')),

        CONSTRAINT FK_Mantenimiento_Equipo FOREIGN KEY (equipo_id) REFERENCES Equipo(equipo_id),
        CONSTRAINT FK_Mantenimiento_Tecnico FOREIGN KEY (tecnico_id) REFERENCES Tecnico(tecnico_id)
    );
END;