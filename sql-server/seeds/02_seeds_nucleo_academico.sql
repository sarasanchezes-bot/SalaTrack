USE SalaTrack;
GO

-- Cursos del semestre 2026-2
INSERT INTO Curso (nombre, codigo, programa_academico, docente_responsable, semestre) VALUES
('BASE DE DATOS AVANZADA (LINEA PROF. I)', 'ISLPE04', 'Ingenieria de Sistemas', 'Pedro Alvarez', '2026-2'),
('INTELIGENCIA ARTIFICIAL (LINEA PROF. II)', 'ISLPE05', 'Ingenieria de Sistemas', 'Carlos Perez', '2026-2'),
('SEGURIDAD INFORMATICA (SEM. ACTUALIZACION II)', 'ISSAE05', 'Ingenieria de Sistemas', 'Laura Gomez', '2026-2'),
('ARQUITECTURA DE SISTEMAS', 'IS066', 'Ingenieria de Sistemas', 'Andres Rios', '2026-2');
GO

-- Requisitos por curso. software_id segun el catalogo que tenemos de momento.
-- 1=SQL Server 2022, 2=Visual Studio, 3=Python, 4=MongoDB Compass, 5=Docker Desktop (Estos son ejemplos)
INSERT INTO RequisitoCurso (curso_id, software_id, descripcion_configuracion, nivel_permiso_necesario, es_obligatorio) VALUES
(1, 1, NULL, 'administrador', 1),
(1, NULL, 'habilitar conexiones TCP', 'administrador', 1),
(1, 4, NULL, 'estandar', 0),
(2, 2, NULL, 'estandar', 1),
(2, 5, NULL, 'estandar', 0),
(3, 3, NULL, 'estandar', 1),
(3, 5, NULL, 'administrador', 1),
(4, 5, NULL, 'administrador', 1),
(4, 4, NULL, 'estandar', 1);
GO

-- Asignaciones semestrales, cruzadas con las 3 salas reales (301=1, 302=2, Lab 401=3).
-- Sala 1 tiene SQL Server, Visual Studio y Docker instalados.
-- Sala 2 solo tiene Visual Studio y Python.
-- Sala 3 tiene Python, MongoDB y Docker.
-- Curso 4 (ARQUITECTURA DE SISTEMAS) se deja a proposito en Sala 2, que NO tiene
-- Docker ni MongoDB instalados: la vista vw_verificacion_compatibilidad de la
-- lider debe marcar ambos como FALTA.
INSERT INTO AsignacionSemestral (sala_id, curso_id, semestre, dia_semana, hora_inicio, hora_fin, perfil_permisos, estado) VALUES
(1, 1, '2026-2', 'Lunes', '08:00', '10:00', 'administrador', 'asignada'),
(2, 2, '2026-2', 'Martes', '10:00', '12:00', 'estandar', 'asignada'),
(3, 3, '2026-2', 'Miercoles', '14:00', '16:00', 'administrador', 'asignada'),
(2, 4, '2026-2', 'Jueves', '08:00', '10:00', 'administrador', 'asignada con requisitos pendientes');
GO

PRINT 'Seeds del nucleo academico insertados correctamente';
GO