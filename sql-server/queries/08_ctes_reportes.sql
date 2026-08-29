USE SalaTrack;
GO
WITH FaltantesPorSala AS (
    SELECT
        sala,
        COUNT(*) AS total_faltantes
    FROM vw_verificacion_compatibilidad
    WHERE estado_requisito = 'FALTA'
    GROUP BY sala
)
SELECT
    sala,
    total_faltantes,
    RANK() OVER (ORDER BY total_faltantes DESC) AS prioridad_inversion
FROM FaltantesPorSala
ORDER BY prioridad_inversion;
GO

-- ============================================================
-- CTE 2 (recursiva) — apoyo a RF-11
-- Genera el calendario de sesiones de clase de cada asignacion
-- semestral (una fila por cada fecha en que se repite el
-- dia_semana asignado, entre el inicio y el fin del semestre).
-- Sirve para calcular frecuencia real de uso de cada sala.
-- ============================================================
DECLARE @inicio_semestre DATE = '2026-08-03';
DECLARE @fin_semestre    DATE = '2026-11-14';

WITH CalendarioSesiones AS (
    -- Ancla: la primera fecha del semestre por asignacion
    SELECT
        a.asignacion_id,
        a.sala_id,
        a.curso_id,
        a.dia_semana,
        @inicio_semestre AS fecha_sesion
    FROM AsignacionSemestral a
    WHERE a.estado <> 'cancelada'

    UNION ALL

    -- Recursion: avanza un dia a la vez hasta encontrar
    -- la siguiente fecha que coincida con dia_semana
    SELECT
        c.asignacion_id,
        c.sala_id,
        c.curso_id,
        c.dia_semana,
        DATEADD(DAY, 1, c.fecha_sesion)
    FROM CalendarioSesiones c
    WHERE DATEADD(DAY, 1, c.fecha_sesion) <= @fin_semestre
)
SELECT
    asignacion_id,
    sala_id,
    curso_id,
    fecha_sesion
FROM CalendarioSesiones
WHERE dia_semana = CASE (DATEPART(WEEKDAY, fecha_sesion) + @@DATEFIRST - 2) % 7
        WHEN 0 THEN 'Lunes'
        WHEN 1 THEN 'Martes'
        WHEN 2 THEN 'Miercoles'
        WHEN 3 THEN 'Jueves'
        WHEN 4 THEN 'Viernes'
        WHEN 5 THEN 'Sabado'
        WHEN 6 THEN 'Domingo'
     END
ORDER BY sala_id, fecha_sesion
OPTION (MAXRECURSION 400);
GO
-- Nota: el mapeo de dia_semana usa DATEPART + @@DATEFIRST en vez de
-- DATENAME(WEEKDAY,...) porque DATENAME depende del idioma configurado
-- en la instancia de SQL Server (podria devolver 'Monday' en vez de
-- 'Lunes'). Este calculo es independiente de esa configuracion.