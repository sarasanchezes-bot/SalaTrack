IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Mantenimiento')
BEGIN
    CREATE TABLE Mantenimiento (
        id_mantenimiento INT IDENTITY(1,1) PRIMARY KEY,
        id_equipo INT NOT NULL,
        id_tecnico INT NOT NULL,
        fecha_mantenimiento DATETIME DEFAULT GETDATE(),
        tipo_mantenimiento VARCHAR(50) CHECK (tipo_mantenimiento IN ('Preventivo', 'Correctivo')),
        descripcion VARCHAR(255) NOT NULL,
        costo DECIMAL(10,2) CHECK (costo >= 0),
        
        CONSTRAINT FK_Mantenimiento_Equipo FOREIGN KEY (id_equipo) REFERENCES Equipo(id_equipo)
    );
END;