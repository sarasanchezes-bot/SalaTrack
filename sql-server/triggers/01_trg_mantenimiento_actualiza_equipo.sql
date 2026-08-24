USE SalaTrack;
GO

IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_mantenimiento_actualiza_equipo')
    DROP TRIGGER trg_mantenimiento_actualiza_equipo;
GO

CREATE TRIGGER trg_mantenimiento_actualiza_equipo
ON Mantenimiento
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE E
    SET E.estado = 'en mantenimiento'
    FROM Equipo E
    INNER JOIN inserted I ON E.equipo_id = I.equipo_id;
END;
GO