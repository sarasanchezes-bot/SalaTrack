IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tecnico')
BEGIN
    CREATE TABLE Tecnico (
        tecnico_id INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        especialidad VARCHAR(100) NULL,
        activo BIT DEFAULT 1
    );
END;