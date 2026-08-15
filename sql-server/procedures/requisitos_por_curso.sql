USE SalaTrack;
GO

-- Lista, por cada curso, sus requisitos separando obligatorios y opcionales (Obviamente basado en el requisito funcional 5).
CREATE VIEW vw_requisitos_por_curso AS
SELECT
    c.curso_id,
    c.nombre AS curso,
    c.codigo,
    c.semestre,
    COALESCE(s.nombre, rc.descripcion_configuracion) AS requisito,
    rc.nivel_permiso_necesario,
    CASE WHEN rc.es_obligatorio = 1 THEN 'Obligatorio' ELSE 'Opcional' END AS categoria
FROM RequisitoCurso rc
JOIN Curso c ON c.curso_id = rc.curso_id
LEFT JOIN Software s ON s.software_id = rc.software_id;
GO

-- Asi se usa muchachos:
-- SELECT * FROM vw_requisitos_por_curso ORDER BY curso_id, categoria;
