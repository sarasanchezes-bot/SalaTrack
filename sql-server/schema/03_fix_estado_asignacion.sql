USE SalaTrack;
GO

-- Corrige el ancho de AsignacionSemestral.estado: NVARCHAR(30) no alcanzaba
-- para 'asignada con requisitos pendientes' (34 caracteres).
ALTER TABLE AsignacionSemestral
ALTER COLUMN estado NVARCHAR(50) NOT NULL;
GO
