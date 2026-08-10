USE SalaTrack;
GO

-- Cursos ofrecidos por semestre, con su docente responsable.
CREATE TABLE Curso (
    curso_id            INT IDENTITY(1,1) PRIMARY KEY,
    nombre              NVARCHAR(100) NOT NULL,
    codigo              NVARCHAR(20)  NOT NULL,
    programa_academico  NVARCHAR(100) NOT NULL,
    docente_responsable NVARCHAR(100) NOT NULL,
    semestre            NVARCHAR(10)  NOT NULL,
    CONSTRAINT UQ_Curso_codigo_semestre UNIQUE (codigo, semestre)
);
GO

-- Requisitos tecnicos de un curso: software especifico, una configuracion, o ambos.
CREATE TABLE RequisitoCurso (
    requisito_curso_id       INT IDENTITY(1,1) PRIMARY KEY,
    curso_id                 INT NOT NULL,
    software_id               INT NULL,
    descripcion_configuracion NVARCHAR(200) NULL,
    nivel_permiso_necesario   NVARCHAR(50) NOT NULL,
    es_obligatorio            BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_RequisitoCurso_Curso FOREIGN KEY (curso_id) REFERENCES Curso(curso_id),
    CONSTRAINT FK_RequisitoCurso_Software FOREIGN KEY (software_id) REFERENCES Software(software_id),
    CONSTRAINT CK_RequisitoCurso_tiene_requisito CHECK (software_id IS NOT NULL OR descripcion_configuracion IS NOT NULL)
);
GO

-- Cruce entre una sala y un curso para un semestre, con horario fijo y perfil de permisos.
CREATE TABLE AsignacionSemestral (
    asignacion_id   INT IDENTITY(1,1) PRIMARY KEY,
    sala_id         INT NOT NULL,
    curso_id        INT NOT NULL,
    semestre        NVARCHAR(10) NOT NULL,
    dia_semana      NVARCHAR(15) NOT NULL,
    hora_inicio     TIME NOT NULL,
    hora_fin        TIME NOT NULL,
    perfil_permisos NVARCHAR(50) NOT NULL,
    estado          NVARCHAR(30) NOT NULL DEFAULT 'asignada',
    CONSTRAINT FK_AsignacionSemestral_Sala FOREIGN KEY (sala_id) REFERENCES Sala(sala_id),
    CONSTRAINT FK_AsignacionSemestral_Curso FOREIGN KEY (curso_id) REFERENCES Curso(curso_id),
    CONSTRAINT CK_AsignacionSemestral_horario CHECK (hora_fin > hora_inicio),
    CONSTRAINT CK_AsignacionSemestral_estado CHECK (estado IN ('asignada', 'asignada con requisitos pendientes', 'cancelada')),
    CONSTRAINT UQ_AsignacionSemestral_horario UNIQUE (sala_id, semestre, dia_semana, hora_inicio)
);
GO

PRINT 'Nucleo academico creado correctamente: Curso, RequisitoCurso, AsignacionSemestral';
GO