USE SalaTrack;
GO

IF OBJECT_ID('dbo.fn_requisitos_pendientes_sala', 'FN') IS NOT NULL
    DROP FUNCTION dbo.fn_requisitos_pendientes_sala;
GO

CREATE FUNCTION dbo.fn_requisitos_pendientes_sala (
    @sala_id INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT 
        r.requisito_id,
        r.descripcion,
        r.estado,
        r.fecha_solicitud
    FROM Requisito r
    WHERE r.sala_id = @sala_id
      AND r.estado = 'Pendiente'
);
GO