USE SalaTrack;
GO

-- RF-07 — Lista de instalación automática por sala
-- A partir de las asignaciones del semestre, lista el software
-- obligatorio que le falta a cada sala (su "lista de tareas" de
-- instalación). Se apoya en la vista de verificación (RF-06).
CREATE OR ALTER VIEW vw_lista_instalacion AS
SELECT
    sala,
    software_requerido AS software_a_instalar,
    COUNT(*) AS cursos_que_lo_necesitan
FROM vw_verificacion_compatibilidad
WHERE estado_requisito = 'FALTA'
GROUP BY sala, software_requerido;
GO