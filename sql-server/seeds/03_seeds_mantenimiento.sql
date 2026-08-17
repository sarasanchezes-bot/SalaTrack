INSERT INTO Tecnico (nombre, especialidad, activo)
VALUES 
('Carlos Pérez', 'Sistemas Operativos y Redes', 1),
('Ana María Gómez', 'Mantenimiento de Hardware y Periféricos', 1);

-- Inserción de Registros de Mantenimiento
INSERT INTO Mantenimiento (equipo_id, tecnico_id, fecha_mantenimiento, tipo_mantenimiento, descripcion, costo, estado)
VALUES 
(1, 1, '2026-08-01 09:00:00', 'Preventivo', 'Limpieza interna de componentes y actualización de drivers de red', 50000.00, 'Completado'),
(2, 2, '2026-08-05 14:30:00', 'Correctivo', 'Reemplazo de fuente de poder defectuosa y pruebas de voltaje', 120000.00, 'En Proceso');