USE SalaTrack;
GO

-- 1) Salas
INSERT INTO Sala (nombre, ubicacion, capacidad, estado) VALUES
('Sala 301',        'Bloque 1 - Piso 3', 30, 'disponible'),
('Sala 302',        'Bloque 1 - Piso 3', 25, 'disponible'),
('Laboratorio 401', 'Bloque 2 - Piso 4', 20, 'disponible');
GO

-- 2) Equipos (FK sala_id -> Sala)
INSERT INTO Equipo (sala_id, especificaciones, estado) VALUES
(1, 'Core i5, 8GB RAM, 256GB SSD', 'disponible'),
(1, 'Core i5, 8GB RAM, 256GB SSD', 'disponible'),
(2, 'Core i3, 4GB RAM, 500GB HDD', 'disponible'),
(2, 'Core i3, 4GB RAM, 500GB HDD', 'en mantenimiento'),
(3, 'Core i7, 16GB RAM, 512GB SSD', 'disponible'),
(3, 'Core i7, 16GB RAM, 512GB SSD', 'disponible');
GO

-- 3) Software (catálogo) — ¡ORDEN CRÍTICO! fija el software_id
-- 1=SQL Server, 2=Visual Studio, 3=Python, 4=MongoDB Compass, 5=Docker
INSERT INTO Software (nombre, version, tipo_licencia) VALUES
('SQL Server 2022', '16.0', 'Developer'),
('Visual Studio',   '2022', 'Community'),
('Python',          '3.12', 'Libre'),
('MongoDB Compass', '1.42', 'Libre'),
('Docker Desktop',  '4.30', 'Comercial');
GO

-- 4) EquipoSoftware (qué está instalado dónde)
-- Sala 301 (equipos 1,2) SÍ tiene SQL Server; 302 y Lab 401 NO.
INSERT INTO EquipoSoftware (equipo_id, software_id, nivel_permisos) VALUES
(1, 1, 'restringido'),
(1, 2, 'estandar'),
(1, 5, 'administrador'),
(2, 1, 'restringido'),
(2, 2, 'estandar'),
(3, 3, 'estandar'),
(3, 2, 'estandar'),
(4, 3, 'estandar'),
(5, 3, 'estandar'),
(5, 4, 'estandar'),
(5, 5, 'administrador'),
(6, 3, 'estandar'),
(6, 4, 'estandar');
GO

SELECT * FROM Sala;
GO