USE SalaTrack;
GO

CREATE TABLE RequisitoPendiente (
    pendiente_id       INT IDENTITY(1,1) PRIMARY KEY,
    asignacion_id      INT NOT NULL,
    requisito_curso_id INT NOT NULL,
    motivo             NVARCHAR(50)  NOT NULL,
    detalle            NVARCHAR(300) NULL,
    fecha_deteccion    DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    estado             NVARCHAR(20)  NOT NULL DEFAULT 'pendiente',
    CONSTRAINT FK_RequisitoPendiente_Asignacion
        FOREIGN KEY (asignacion_id) REFERENCES AsignacionSemestral(asignacion_id),
    CONSTRAINT FK_RequisitoPendiente_Requisito
        FOREIGN KEY (requisito_curso_id) REFERENCES RequisitoCurso(requisito_curso_id),
    CONSTRAINT CK_RequisitoPendiente_motivo
        CHECK (motivo IN ('software no instalado', 'permisos insuficientes', 'configuracion no verificable')),
    CONSTRAINT CK_RequisitoPendiente_estado
        CHECK (estado IN ('pendiente', 'resuelto', 'descartado')),
    CONSTRAINT UQ_RequisitoPendiente_asignacion_requisito
        UNIQUE (asignacion_id, requisito_curso_id)
);
GO

PRINT 'Tabla RequisitoPendiente creada correctamente';
GO