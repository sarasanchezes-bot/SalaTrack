USE SalaTrack;
GO

-- RF-06 — Verificación de compatibilidad sala/curso
-- Vista que lista, por cada asignación semestral, los requisitos
-- obligatorios de software del curso y si la sala asignada los
-- cumple ('OK') o no ('FALTA').

CREATE OR ALTER VIEW vw_verificacion_compatibilidad AS
SELECT
    a.asignacion_id,
    sa.nombre  AS sala,
    c.nombre   AS curso,
    s.nombre   AS software_requerido,
    CASE WHEN es.software_id IS NULL THEN 'FALTA' ELSE 'OK' END AS estado_requisito
FROM AsignacionSemestral a
JOIN Curso          c  ON c.curso_id   = a.curso_id
JOIN Sala           sa ON sa.sala_id   = a.sala_id
JOIN RequisitoCurso rc ON rc.curso_id  = a.curso_id
                       AND rc.es_obligatorio = 1
                       AND rc.software_id IS NOT NULL
JOIN Software       s  ON s.software_id = rc.software_id
LEFT JOIN (
    SELECT DISTINCT e.sala_id, es.software_id
    FROM EquipoSoftware es
    JOIN Equipo e ON e.equipo_id = es.equipo_id
) es ON es.sala_id = a.sala_id
     AND es.software_id = rc.software_id;
GO