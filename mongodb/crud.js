// ============================================================================
// SALATRACK - UNIDAD 2: MONGODB CRUD & DATO DE PRUEBA
// Autor: Pedro Watson
// Descripción: Scripts de inserción y operaciones CRUD adaptados al esquema de Juan
// ============================================================================

// Seleccionar la base de datos correctamente dentro de un archivo de script
db = db.getSiblingDB("salatrack");

// ----------------------------------------------------------------------------
// 1. DATO DE PRUEBA: 20 INCIDENCIAS VALIDadas CON EL ESQUEMA DE JUAN
// (Salas: 1, 2, 3 | Equipos: 1 al 6)
// ----------------------------------------------------------------------------
const incidenciasPrueba = [
  {
    _id: ObjectId("650c1f1e1c9d440000000001"),
    sala_id: 1,
    equipo_id: 1,
    reportado_por: { nombre: "Carlos Gómez", rol: "Profesor" },
    fecha_reporte: ISODate("2026-10-01T08:30:00Z"),
    tipo: "hardware",
    severidad: "alta",
    curso: "Bases de Datos I",
    detalle: "El equipo 1 de la Sala 1 se reinicia inesperadamente al ejecutar simulaciones.",
    estado: "abierta",
    etiquetas: ["matlab", "pantalla_azul"],
    adjuntos: [
      { nombre: "error_log.txt", URL: "https://storage.salatrack.edu/logs/err_1.txt" }
    ],
    historial: [
      { fecha: ISODate("2026-10-01T08:30:00Z"), accion: "Reporte creado" }
    ]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000002"),
    sala_id: 1,
    equipo_id: 2,
    reportado_por: { nombre: "Sara Sánchez", rol: "Administrador" },
    fecha_reporte: ISODate("2026-10-02T09:15:00Z"),
    tipo: "periferico",
    severidad: "media",
    curso: "Redes I",
    detalle: "Teclado sin respuesta en conector USB frontal.",
    estado: "en_proceso",
    tecnico_asignado: {
      tecnico_id: 3,
      nombre: "Luis Martínez",
      fecha_asignacion: ISODate("2026-10-02T10:00:00Z")
    },
    historial: [
      { fecha: ISODate("2026-10-02T10:30:00Z"), accion: "Asignado a técnico" }
    ]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000003"),
    sala_id: 2,
    equipo_id: 3,
    reportado_por: { nombre: "Ana María Ríos", rol: "Profesor" },
    fecha_reporte: ISODate("2026-10-03T11:00:00Z"),
    tipo: "software",
    severidad: "baja",
    curso: "Arquitectura",
    detalle: "El software solicita autenticación de cuenta no registrada.",
    estado: "resuelta",
    solucion: {
      fecha_resolucion: ISODate("2026-10-03T14:20:00Z"),
      tecnico: "Pedro Watson",
      accion_realizada: "Reinstalación de paquete de licencias."
    },
    historial: [
      { fecha: ISODate("2026-10-03T14:20:00Z"), accion: "Resuelto" }
    ]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000004"),
    sala_id: 3,
    equipo_id: 4,
    reportado_por: { nombre: "Juan Pérez", rol: "Estudiante" },
    fecha_reporte: ISODate("2026-10-04T15:45:00Z"),
    tipo: "hardware",
    severidad: "media",
    curso: "Sistemas Operativos",
    detalle: "El cooler del procesador suena ruidoso y baja la frecuencia de reloj.",
    estado: "abierta",
    historial: [{ fecha: ISODate("2026-10-04T15:45:00Z"), accion: "Reporte creado" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000005"),
    sala_id: 2,
    equipo_id: 5,
    reportado_por: { nombre: "Mario Castaño", rol: "Profesor" },
    fecha_reporte: ISODate("2026-10-05T07:45:00Z"),
    tipo: "redes",
    severidad: "alta",
    curso: "Telecomunicaciones",
    detalle: "El puerto RJ45 del equipo no levanta enlace ni asigna IP por DHCP.",
    estado: "en_proceso",
    historial: [{ fecha: ISODate("2026-10-05T07:45:00Z"), accion: "Reporte creado" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000006"),
    sala_id: 3,
    equipo_id: 6,
    reportado_por: { nombre: "Sistemas Central", rol: "Soporte" },
    fecha_reporte: ISODate("2026-10-06T12:00:00Z"),
    tipo: "hardware",
    severidad: "baja",
    curso: "General",
    detalle: "El cable HDMI del puesto tiene un pin doblado.",
    estado: "resuelta",
    historial: [{ fecha: ISODate("2026-10-06T12:00:00Z"), accion: "Resuelto" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000007"),
    sala_id: 1,
    equipo_id: 1,
    reportado_por: { nombre: "Sara Sánchez", rol: "Administrador" },
    fecha_reporte: ISODate("2026-10-07T14:10:00Z"),
    tipo: "software",
    severidad: "alta",
    curso: "Bases de Datos I",
    detalle: "No está instalada la versión 8.0 requerida de MySQL Workbench.",
    estado: "abierta",
    historial: [{ fecha: ISODate("2026-10-07T14:10:00Z"), accion: "Reporte creado" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000008"),
    sala_id: 3,
    equipo_id: 2,
    reportado_por: { nombre: "Pedro Watson", rol: "Estudiante" },
    fecha_reporte: ISODate("2026-10-08T16:30:00Z"),
    tipo: "periferico",
    severidad: "baja",
    curso: "Programación I",
    detalle: "El cursor salta erráticamente al mover el ratón.",
    estado: "cerrada",
    historial: [{ fecha: ISODate("2026-10-08T16:30:00Z"), accion: "Cerrado" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000009"),
    sala_id: 2,
    equipo_id: 3,
    reportado_por: { nombre: "Carlos Gómez", rol: "Profesor" },
    fecha_reporte: ISODate("2026-10-09T08:00:00Z"),
    tipo: "hardware",
    severidad: "critica",
    curso: "Hardware",
    detalle: "El equipo emite 3 pitidos largos y no da video al encender.",
    estado: "en_proceso",
    historial: [{ fecha: ISODate("2026-10-09T08:00:00Z"), accion: "En diagnóstico" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000010"),
    sala_id: 1,
    equipo_id: 4,
    reportado_por: { nombre: "Laura Ospina", rol: "Estudiante" },
    fecha_reporte: ISODate("2026-10-10T10:20:00Z"),
    tipo: "periferico",
    severidad: "baja",
    curso: "Inglés",
    detalle: "No hay salida de audio en el canal izquierdo de los audífonos.",
    estado: "abierta",
    historial: [{ fecha: ISODate("2026-10-10T10:20:00Z"), accion: "Reporte creado" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000011"),
    sala_id: 3,
    equipo_id: 5,
    reportado_por: { nombre: "Fernando Ruiz", rol: "Profesor" },
    fecha_reporte: ISODate("2026-10-11T13:45:00Z"),
    tipo: "software",
    severidad: "media",
    curso: "Sistemas",
    detalle: "El sistema intenta revertir cambios de Windows Update en cada inicio.",
    estado: "en_proceso",
    historial: [{ fecha: ISODate("2026-10-11T13:45:00Z"), accion: "En proceso" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000012"),
    sala_id: 1,
    equipo_id: 6,
    reportado_por: { nombre: "Juan Pérez", rol: "Estudiante" },
    fecha_reporte: ISODate("2026-10-12T15:00:00Z"),
    tipo: "hardware",
    severidad: "critica",
    curso: "Bases de Datos II",
    detalle: "La bios arroja advertencia de fallo inminente en SSD.",
    estado: "abierta",
    historial: [{ fecha: ISODate("2026-10-12T15:00:00Z"), accion: "Reporte crítico" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000013"),
    sala_id: 2,
    equipo_id: 1,
    reportado_por: { nombre: "Sara Sánchez", rol: "Administrador" },
    fecha_reporte: ISODate("2026-10-13T09:00:00Z"),
    tipo: "software",
    severidad: "alta",
    curso: "Inteligencia Artificial",
    detalle: "Incompatibilidad de versión de Python en Anaconda.",
    estado: "resuelta",
    historial: [{ fecha: ISODate("2026-10-13T09:00:00Z"), accion: "Resuelto" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000014"),
    sala_id: 3,
    equipo_id: 2,
    reportado_por: { nombre: "Ana María Ríos", rol: "Profesor" },
    fecha_reporte: ISODate("2026-10-14T11:15:00Z"),
    tipo: "infraestructura",
    severidad: "alta",
    curso: "Física",
    detalle: "Toma eléctrica de pared suelta junto al escritorio.",
    estado: "abierta",
    historial: [{ fecha: ISODate("2026-10-14T11:15:00Z"), accion: "Reportado" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000015"),
    sala_id: 2,
    equipo_id: 3,
    reportado_por: { nombre: "Pedro Watson", rol: "Estudiante" },
    fecha_reporte: ISODate("2026-10-15T14:50:00Z"),
    tipo: "hardware",
    severidad: "media",
    curso: "Multimedia",
    detalle: "Configuración de resolución incorrecta en proyector.",
    estado: "resuelta",
    historial: [{ fecha: ISODate("2026-10-15T14:50:00Z"), accion: "Resuelto" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000016"),
    sala_id: 1,
    equipo_id: 4,
    reportado_por: { nombre: "Mario Castaño", rol: "Profesor" },
    fecha_reporte: ISODate("2026-10-16T16:00:00Z"),
    tipo: "software",
    severidad: "alta",
    curso: "Ciberseguridad",
    detalle: "Infección por malware simulado en práctica sin aislar.",
    estado: "cerrada",
    historial: [{ fecha: ISODate("2026-10-16T16:00:00Z"), accion: "Cerrado" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000017"),
    sala_id: 2,
    equipo_id: 5,
    reportado_por: { nombre: "Laura Ospina", rol: "Estudiante" },
    fecha_reporte: ISODate("2026-10-17T08:45:00Z"),
    tipo: "mobiliario",
    severidad: "baja",
    curso: "General",
    detalle: "Silla ergonómica de la estación averiada.",
    estado: "abierta",
    historial: [{ fecha: ISODate("2026-10-17T08:45:00Z"), accion: "Reportado" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000018"),
    sala_id: 3,
    equipo_id: 6,
    reportado_por: { nombre: "Carlos Gómez", rol: "Profesor" },
    fecha_reporte: ISODate("2026-10-18T10:30:00Z"),
    tipo: "hardware",
    severidad: "media",
    curso: "Seguridad",
    detalle: "Lector de huella biológico deshabilitado.",
    estado: "en_proceso",
    historial: [{ fecha: ISODate("2026-10-18T10:30:00Z"), accion: "En revisión" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000019"),
    sala_id: 1,
    equipo_id: 1,
    reportado_por: { nombre: "Juan Pérez", rol: "Estudiante" },
    fecha_reporte: ISODate("2026-10-19T13:10:00Z"),
    tipo: "software",
    severidad: "alta",
    curso: "Sistemas",
    detalle: "Falta de espacio en disco C: por archivos temporales.",
    estado: "abierta",
    historial: [{ fecha: ISODate("2026-10-19T13:10:00Z"), accion: "Reportado" }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000020"),
    sala_id: 2,
    equipo_id: 2,
    reportado_por: { nombre: "Sara Sánchez", rol: "Administrador" },
    fecha_reporte: ISODate("2026-10-20T17:00:00Z"),
    tipo: "redes",
    severidad: "baja",
    curso: "Redes II",
    detalle: "Cable de red sin pestillo de seguridad.",
    estado: "resuelta",
    historial: [{ fecha: ISODate("2026-10-20T17:00:00Z"), accion: "Resuelto" }]
  }
];

// Insertar documentos (Sin hacer .drop() para respetar los validadores de Juan)
db.incidencias.insertMany(incidenciasPrueba);
console.log("-> 20 incidencias validadas insertadas correctamente.");

// ============================================================================
// 2. SEIS OPERACIONES CRUD OBLIGATORIAS (ADAPTADAS AL NUEVO ESQUEMA)
// ============================================================================

// COMANDO 1: insertOne
db.incidencias.insertOne({
  sala_id: 1,
  equipo_id: 3,
  reportado_por: { nombre: "Pedro Watson", rol: "Estudiante" },
  fecha_reporte: new Date(),
  tipo: "hardware",
  severidad: "alta",
  curso: "Bases de Datos I",
  detalle: "Fallo de comunicación en puerto COM2.",
  estado: "abierta",
  historial: [{ fecha: new Date(), accion: "Creado por insertOne" }]
});

// COMANDO 2: insertMany
db.incidencias.insertMany([
  {
    sala_id: 2,
    equipo_id: 4,
    reportado_por: { nombre: "Sistemas Auxiliar", rol: "Soporte" },
    fecha_reporte: new Date(),
    tipo: "software",
    severidad: "media",
    curso: "General",
    detalle: "Error de certificado SSL en navegador.",
    estado: "abierta",
    historial: [{ fecha: new Date(), accion: "Lote de prueba 1" }]
  },
  {
    sala_id: 3,
    equipo_id: 5,
    reportado_por: { nombre: "Sistemas Auxiliar", rol: "Soporte" },
    fecha_reporte: new Date(),
    tipo: "hardware",
    severidad: "baja",
    curso: "General",
    detalle: "Reloj del sistema desconfigurado (Pila CMOS).",
    estado: "abierta",
    historial: [{ fecha: new Date(), accion: "Lote de prueba 2" }]
  }
]);

// COMANDO 3: find (con filtros)
db.incidencias.find(
  {
    sala_id: 1,
    severidad: { $in: ["alta", "critica"] }
  },
  {
    detalle: 1,
    equipo_id: 1,
    severidad: 1,
    estado: 1,
    _id: 0
  }
);

// COMANDO 4: updateOne
db.incidencias.updateOne(
  { _id: ObjectId("650c1f1e1c9d440000000001") },
  {
    $set: {
      estado: "en_proceso",
      tecnico_asignado: {
        tecnico_id: 2,
        nombre: "Pedro Watson",
        fecha_asignacion: new Date()
      }
    }
  }
);

// COMANDO 5: updateMany
db.incidencias.updateMany(
  { estado: "abierta" },
  {
    $set: { revisado_en_mantenimiento: true },
    $push: {
      historial: {
        fecha: new Date(),
        accion: "Revisión general en jornada técnica"
      }
    }
  }
);

// COMANDO 6: deleteOne
db.incidencias.deleteOne({ _id: ObjectId("650c1f1e1c9d440000000008") });