-- ============================================================
-- SalaTrack — Script de creación: Núcleo físico
-- Unidad 1 (SQL Server) — Tablas: Sala, Equipo, Software, EquipoSoftware
-- ============================================================
-- Este script crea las tablas del núcleo físico del sistema:
-- las salas, los equipos que contienen, el software disponible
-- y la relación entre equipos y software instalado.
-- ============================================================

-- Seleccionar la base de datos de trabajo
USE SalaTrack;
GO

-- ============================================================
-- Tabla: Sala
-- Representa cada sala de cómputo de la universidad.
-- ============================================================
CREATE TABLE Sala (
    sala_id       INT IDENTITY(1,1) PRIMARY KEY,   -- identificador único autoincremental
    nombre        NVARCHAR(50)  NOT NULL,           -- ej: "Sala 301"
    ubicacion     NVARCHAR(100) NOT NULL,           -- ej: "Bloque 1 - Piso 3"
    capacidad     INT           NOT NULL,           -- número de puestos/equipos
    estado        NVARCHAR(20)  NOT NULL DEFAULT 'disponible',  -- disponible / fuera de servicio
    CONSTRAINT CK_Sala_capacidad CHECK (capacidad > 0),
    CONSTRAINT CK_Sala_estado CHECK (estado IN ('disponible', 'fuera de servicio'))
);
GO

-- ============================================================
-- Tabla: Equipo
-- Cada computador físico que pertenece a una sala.
-- Relación: una Sala tiene muchos Equipos (uno a muchos).
-- La FK sala_id va aquí, en el lado "muchos".
-- ============================================================
CREATE TABLE Equipo (
    equipo_id        INT IDENTITY(1,1) PRIMARY KEY,
    sala_id          INT NOT NULL,                  -- FK: a qué sala pertenece
    especificaciones NVARCHAR(200) NULL,            -- ej: "Core i5, 8GB RAM, 256GB SSD"
    estado           NVARCHAR(20) NOT NULL DEFAULT 'disponible',  -- disponible / en mantenimiento / fuera de servicio
    CONSTRAINT FK_Equipo_Sala FOREIGN KEY (sala_id) REFERENCES Sala(sala_id),
    CONSTRAINT CK_Equipo_estado CHECK (estado IN ('disponible', 'en mantenimiento', 'fuera de servicio'))
);
GO

-- ============================================================
-- Tabla: Software
-- Catálogo de software que puede estar instalado en los equipos.
-- ============================================================
CREATE TABLE Software (
    software_id   INT IDENTITY(1,1) PRIMARY KEY,
    nombre        NVARCHAR(100) NOT NULL,           -- ej: "SQL Server 2022"
    version       NVARCHAR(50)  NULL,               -- ej: "16.0"
    tipo_licencia NVARCHAR(50)  NULL,               -- ej: "Developer", "Libre", "Comercial"
);
GO

-- ============================================================
-- Tabla: EquipoSoftware (tabla intermedia)
-- Resuelve la relación muchos a muchos entre Equipo y Software:
-- un equipo tiene muchos software, y un software está en muchos equipos.
-- Guarda además el nivel de permisos de esa instalación.
-- ============================================================
CREATE TABLE EquipoSoftware (
    equipo_id        INT NOT NULL,                  -- FK a Equipo
    software_id      INT NOT NULL,                  -- FK a Software
    nivel_permisos   NVARCHAR(50) NOT NULL DEFAULT 'estandar',  -- ej: "estandar", "administrador", "restringido"
    -- La clave primaria es la combinación de ambas FKs:
    -- un mismo software no se registra dos veces en el mismo equipo.
    CONSTRAINT PK_EquipoSoftware PRIMARY KEY (equipo_id, software_id),
    CONSTRAINT FK_EquipoSoftware_Equipo   FOREIGN KEY (equipo_id)   REFERENCES Equipo(equipo_id),
    CONSTRAINT FK_EquipoSoftware_Software FOREIGN KEY (software_id) REFERENCES Software(software_id)
);
GO

-- ============================================================
-- Fin del script del núcleo físico.
-- ============================================================
PRINT 'Núcleo físico creado correctamente: Sala, Equipo, Software, EquipoSoftware';
GO