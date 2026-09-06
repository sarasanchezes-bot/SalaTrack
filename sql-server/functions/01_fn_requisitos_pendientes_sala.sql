USE SalaTrack;
GO

CREATE OR ALTER FUNCTION dbo.fn_requisitos_pendientes_sala (
    @sala_id INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT 
        c.curso_id,
        c.nombre AS curso,
        s.software_id,
        s.nombre AS software_faltante,
        rc.nivel_permiso_necesario
    FROM AsignacionSemestral a
    JOIN Curso c ON c.curso_id = a.curso_id
    JOIN RequisitoCurso rc ON rc.curso_id = a.curso_id
        AND rc.es_obligatorio = 1
        AND rc.software_id IS NOT NULL
    JOIN Software s ON s.software_id = rc.software_id
    WHERE a.sala_id = @sala_id
      AND a.estado <> 'cancelada'
      AND NOT EXISTS (
          SELECT 1
          FROM EquipoSoftware es
          JOIN Equipo e ON e.equipo_id = es.equipo_id
          WHERE e.sala_id = a.sala_id
            AND es.software_id = rc.software_id
      )
);
GO