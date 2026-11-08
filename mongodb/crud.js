// ============================================================================
// SALATRACK - UNIDAD 2: MONGODB CRUD & DATO DE PRUEBA
// Autor: Pedro Watson
// Descripción: Scripts ajustados estrictamente al esquema de validadcion de juan
// ============================================================================

db = db.getSiblingDB("salatrack");

// ----------------------------------------------------------------------------
// 1. 20 INCIDENCIAS DE PRUEBA VALIDADAS CON EL ESQUEMA DE JUAN
// ----------------------------------------------------------------------------
const incidenciasPrueba = [
  {
    _id: ObjectId("650c1f1e1c9d440000000001"),
    sala_id: 1,
    equipo_id: 1,
    reportado_por: { nombre: "Carlos Gómez", rol: "docente" },
    fecha_reporte: ISODate("2026-10-01T08:30:00Z"),
    tipo: "hardware",
    descripcion: "Fallo crítico en tarjeta madre del equipo 1.",
    detalle: { componente: "placa_base", codigo_error: "POST_ERR_03" },
    curso: { curso_id: 1, codigo: "SIS-101", nombre: "Bases de Datos I" },
    estado: "abierta",
    historial: [
      { estado: "abierta", fecha: ISODate("2026-10-01T08:30:00Z") }
    ]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000002"),
    sala_id: 1,
    equipo_id: 2,
    reportado_por: { nombre: "Sara Sánchez", rol: "docente" },
    fecha_reporte: ISODate("2026-10-02T09:15:00Z"),
    tipo: "software",
    descripcion: "Error al iniciar entorno de desarrollo.",
    detalle: { aplicacion: "MySQL Workbench", version: "8.0.32" },
    curso: { curso_id: 2, codigo: "RED-201", nombre: "Redes I" },
    estado: "en_atencion",
    historial: [
      { estado: "abierta", fecha: ISODate("2026-10-02T09:15:00Z") },
      { estado: "en_atencion", fecha: ISODate("2026-10-02T10:00:00Z") }
    ]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000003"),
    sala_id: 2,
    equipo_id: 3,
    reportado_por: { nombre: "Ana María Ríos", rol: "docente" },
    fecha_reporte: ISODate("2026-10-03T11:00:00Z"),
    tipo: "permisos",
    descripcion: "Acceso denegado a carpetas compartidas del curso.",
    detalle: { modulo: "Recursos de Red", nivel_requerido: "Lectura/Escritura" },
    curso: { curso_id: 3, codigo: "ARQ-301", nombre: "Arquitectura" },
    estado: "cerrada",
    historial: [
      { estado: "abierta", fecha: ISODate("2026-10-03T11:00:00Z") },
      { estado: "cerrada", fecha: ISODate("2026-10-03T14:20:00Z") }
    ]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000004"),
    sala_id: 3,
    equipo_id: 4,
    reportado_por: { nombre: "Juan Pérez", rol: "estudiante" },
    fecha_reporte: ISODate("2026-10-04T15:45:00Z"),
    tipo: "hardware",
    descripcion: "Sobrecalentamiento en procesador.",
    detalle: { componente: "ventilador", codigo_error: "FAN_FAIL" },
    curso: { curso_id: 4, codigo: "SO-102", nombre: "Sistemas Operativos" },
    estado: "abierta",
    historial: [{ estado: "abierta", fecha: ISODate("2026-10-04T15:45:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000005"),
    sala_id: 2,
    equipo_id: 5,
    reportado_por: { nombre: "Mario Castaño", rol: "docente" },
    fecha_reporte: ISODate("2026-10-05T07:45:00Z"),
    tipo: "hardware",
    descripcion: "Puerto de red dañado físicamente.",
    detalle: { componente: "puerto_rj45", codigo_error: "NET_PHY_01" },
    curso: { curso_id: 5, codigo: "TEL-202", nombre: "Telecomunicaciones" },
    estado: "en_atencion",
    historial: [{ estado: "en_atencion", fecha: ISODate("2026-10-05T07:45:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000006"),
    sala_id: 3,
    equipo_id: 6,
    reportado_por: { nombre: "Luis Soto", rol: "estudiante" },
    fecha_reporte: ISODate("2026-10-06T12:00:00Z"),
    tipo: "software",
    descripcion: "Falta licencia de software compilador.",
    detalle: { aplicacion: "GCC Compiler", version: "12.2" },
    curso: { curso_id: 6, codigo: "PRG-101", nombre: "Programación I" },
    estado: "cerrada",
    historial: [{ estado: "cerrada", fecha: ISODate("2026-10-06T12:00:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000007"),
    sala_id: 1,
    equipo_id: 1,
    reportado_por: { nombre: "Sara Sánchez", rol: "docente" },
    fecha_reporte: ISODate("2026-10-07T14:10:00Z"),
    tipo: "permisos",
    descripcion: "Sin privilegios para ejecutar script de pruebas.",
    detalle: { modulo: "Base de Datos", nivel_requerido: "DBAdmin" },
    curso: { curso_id: 1, codigo: "SIS-101", nombre: "Bases de Datos I" },
    estado: "abierta",
    historial: [{ estado: "abierta", fecha: ISODate("2026-10-07T14:10:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000008"),
    sala_id: 3,
    equipo_id: 2,
    reportado_por: { nombre: "Pedro Watson", rol: "estudiante" },
    fecha_reporte: ISODate("2026-10-08T16:30:00Z"),
    tipo: "hardware",
    descripcion: "Falla en conector de alimentación.",
    detalle: { componente: "fuente_poder", codigo_error: "PWR_02" },
    curso: { curso_id: 6, codigo: "PRG-101", nombre: "Programación I" },
    estado: "cerrada",
    historial: [{ estado: "cerrada", fecha: ISODate("2026-10-08T16:30:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000009"),
    sala_id: 2,
    equipo_id: 3,
    reportado_por: { nombre: "Carlos Gómez", rol: "docente" },
    fecha_reporte: ISODate("2026-10-09T08:00:00Z"),
    tipo: "hardware",
    descripcion: "Pantalla sin señal de video.",
    detalle: { componente: "gpu_integrada", codigo_error: "VID_ERR_01" },
    curso: { curso_id: 7, codigo: "HW-101", nombre: "Hardware" },
    estado: "en_atencion",
    historial: [{ estado: "en_atencion", fecha: ISODate("2026-10-09T08:00:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000010"),
    sala_id: 1,
    equipo_id: 4,
    reportado_por: { nombre: "Laura Ospina", rol: "estudiante" },
    fecha_reporte: ISODate("2026-10-10T10:20:00Z"),
    tipo: "software",
    descripcion: "Reproductor multimedia con codecs dañados.",
    detalle: { aplicacion: "VLC Player", version: "3.0" },
    curso: { curso_id: 8, codigo: "ING-101", nombre: "Inglés" },
    estado: "abierta",
    historial: [{ estado: "abierta", fecha: ISODate("2026-10-10T10:20:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000011"),
    sala_id: 3,
    equipo_id: 5,
    reportado_por: { nombre: "Fernando Ruiz", rol: "docente" },
    fecha_reporte: ISODate("2026-10-11T13:45:00Z"),
    tipo: "software",
    descripcion: "Fallo en actualización de sistema operativo.",
    detalle: { aplicacion: "Windows Update", version: "11 Pro" },
    curso: { curso_id: 4, codigo: "SO-102", nombre: "Sistemas Operativos" },
    estado: "en_atencion",
    historial: [{ estado: "en_atencion", fecha: ISODate("2026-10-11T13:45:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000012"),
    sala_id: 1,
    equipo_id: 6,
    reportado_por: { nombre: "Juan Pérez", rol: "estudiante" },
    fecha_reporte: ISODate("2026-10-12T15:00:00Z"),
    tipo: "hardware",
    descripcion: "Unidad de almacenamiento con errores SMART.",
    detalle: { componente: "ssd_nvme", codigo_error: "SMART_WARN" },
    curso: { curso_id: 1, codigo: "SIS-101", nombre: "Bases de Datos I" },
    estado: "abierta",
    historial: [{ estado: "abierta", fecha: ISODate("2026-10-12T15:00:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000013"),
    sala_id: 2,
    equipo_id: 1,
    reportado_por: { nombre: "Sara Sánchez", rol: "docente" },
    fecha_reporte: ISODate("2026-10-13T09:00:00Z"),
    tipo: "software",
    descripcion: "Librería de IA desactualizada.",
    detalle: { aplicacion: "Anaconda Python", version: "2023.03" },
    curso: { curso_id: 9, codigo: "IA-401", nombre: "Inteligencia Artificial" },
    estado: "cerrada",
    historial: [{ estado: "cerrada", fecha: ISODate("2026-10-13T09:00:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000014"),
    sala_id: 3,
    equipo_id: 2,
    reportado_por: { nombre: "Ana María Ríos", rol: "docente" },
    fecha_reporte: ISODate("2026-10-14T11:15:00Z"),
    tipo: "hardware",
    descripcion: "Fallo en puertos USB frontales.",
    detalle: { componente: "hub_usb", codigo_error: "USB_FAIL" },
    curso: { curso_id: 10, codigo: "FIS-101", nombre: "Física" },
    estado: "abierta",
    historial: [{ estado: "abierta", fecha: ISODate("2026-10-14T11:15:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000015"),
    sala_id: 2,
    equipo_id: 3,
    reportado_por: { nombre: "Pedro Watson", rol: "estudiante" },
    fecha_reporte: ISODate("2026-10-15T14:50:00Z"),
    tipo: "software",
    descripcion: "Error de renderizado en software gráfico.",
    detalle: { aplicacion: "Blender", version: "3.6" },
    curso: { curso_id: 11, codigo: "MUL-201", nombre: "Multimedia" },
    estado: "cerrada",
    historial: [{ estado: "cerrada", fecha: ISODate("2026-10-15T14:50:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000016"),
    sala_id: 1,
    equipo_id: 4,
    reportado_por: { nombre: "Mario Castaño", rol: "docente" },
    fecha_reporte: ISODate("2026-10-16T16:00:00Z"),
    tipo: "permisos",
    descripcion: "Restricción de ejecución en sandbox de seguridad.",
    detalle: { modulo: "Ciberseguridad Lab", nivel_requerido: "Root" },
    curso: { curso_id: 12, codigo: "SEC-302", nombre: "Ciberseguridad" },
    estado: "cerrada",
    historial: [{ estado: "cerrada", fecha: ISODate("2026-10-16T16:00:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000017"),
    sala_id: 2,
    equipo_id: 5,
    reportado_por: { nombre: "Laura Ospina", rol: "estudiante" },
    fecha_reporte: ISODate("2026-10-17T08:45:00Z"),
    tipo: "hardware",
    descripcion: "Teclado con teclas trabadas.",
    detalle: { componente: "teclado", codigo_error: "KEY_STUCK" },
    curso: { curso_id: 6, codigo: "PRG-101", nombre: "Programación I" },
    estado: "abierta",
    historial: [{ estado: "abierta", fecha: ISODate("2026-10-17T08:45:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000018"),
    sala_id: 3,
    equipo_id: 6,
    reportado_por: { nombre: "Carlos Gómez", rol: "docente" },
    fecha_reporte: ISODate("2026-10-18T10:30:00Z"),
    tipo: "software",
    descripcion: "Entorno de máquina virtual corrupto.",
    detalle: { aplicacion: "VirtualBox", version: "7.0" },
    curso: { curso_id: 12, codigo: "SEC-302", nombre: "Ciberseguridad" },
    estado: "en_atencion",
    historial: [{ estado: "en_atencion", fecha: ISODate("2026-10-18T10:30:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000019"),
    sala_id: 1,
    equipo_id: 1,
    reportado_por: { nombre: "Juan Pérez", rol: "estudiante" },
    fecha_reporte: ISODate("2026-10-19T13:10:00Z"),
    tipo: "software",
    descripcion: "Llenado de espacio temporal en disco.",
    detalle: { aplicacion: "Windows Temp Manager", version: "1.0" },
    curso: { curso_id: 4, codigo: "SO-102", nombre: "Sistemas Operativos" },
    estado: "abierta",
    historial: [{ estado: "abierta", fecha: ISODate("2026-10-19T13:10:00Z") }]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000020"),
    sala_id: 2,
    equipo_id: 2,
    reportado_por: { nombre: "Sara Sánchez", rol: "docente" },
    fecha_reporte: ISODate("2026-10-20T17:00:00Z"),
    tipo: "hardware",
    descripcion: "Fallo de enlace en tarjeta de red.",
    detalle: { componente: "tarjeta_nic", codigo_error: "NET_LINK_DOWN" },
    curso: { curso_id: 2, codigo: "RED-201", nombre: "Redes I" },
    estado: "cerrada",
    historial: [{ estado: "cerrada", fecha: ISODate("2026-10-20T17:00:00Z") }]
  }
];

// Inserción sin drop()
db.incidencias.insertMany(incidenciasPrueba);
console.log("-> 20 incidencias validadas insertadas correctamente.");

// ----------------------------------------------------------------------------
// 2. OPERACIONES CRUD OBLIGATORIAS (ADAPTADAS AL ESQUEMA)
// ----------------------------------------------------------------------------

// COMANDO 1: insertOne
db.incidencias.insertOne({
  sala_id: 1,
  equipo_id: 3,
  reportado_por: { nombre: "Pedro Watson", rol: "estudiante" },
  fecha_reporte: new Date(),
  tipo: "hardware",
  descripcion: "Prueba de inserción unitaria de hardware.",
  detalle: { componente: "puerto_com", codigo_error: "COM_ERR" },
  curso: { curso_id: 1, codigo: "SIS-101", nombre: "Bases de Datos I" },
  estado: "abierta",
  historial: [{ estado: "abierta", fecha: new Date() }]
});

// COMANDO 2: insertMany
db.incidencias.insertMany([
  {
    sala_id: 2,
    equipo_id: 4,
    reportado_por: { nombre: "Soporte Técnico", rol: "docente" },
    fecha_reporte: new Date(),
    tipo: "software",
    descripcion: "Prueba de lote 1 de software.",
    detalle: { aplicacion: "Browser SSL", version: "Latest" },
    curso: { curso_id: 2, codigo: "RED-201", nombre: "Redes I" },
    estado: "abierta",
    historial: [{ estado: "abierta", fecha: new Date() }]
  },
  {
    sala_id: 3,
    equipo_id: 5,
    reportado_por: { nombre: "Soporte Técnico", rol: "docente" },
    fecha_reporte: new Date(),
    tipo: "hardware",
    descripcion: "Prueba de lote 2 de hardware.",
    detalle: { componente: "cmos_battery", codigo_error: "CMOS_LOW" },
    curso: { curso_id: 7, codigo: "HW-101", nombre: "Hardware" },
    estado: "abierta",
    historial: [{ estado: "abierta", fecha: new Date() }]
  }
]);

// COMANDO 3: find
db.incidencias.find(
  { sala_id: 1, tipo: "hardware" },
  { descripcion: 1, equipo_id: 1, estado: 1, _id: 0 }
);

// COMANDO 4: updateOne
db.incidencias.updateOne(
  { _id: ObjectId("650c1f1e1c9d440000000001") },
  {
    $set: { estado: "en_atencion" },
    $push: { historial: { estado: "en_atencion", fecha: new Date() } }
  }
);

// COMANDO 5: updateMany
db.incidencias.updateMany(
  { estado: "abierta" },
  {
    $set: { revision_tecnica: true },
    $push: { historial: { estado: "en_atencion", fecha: new Date() } }
  }
);

// COMANDO 6: deleteOne
db.incidencias.deleteOne({ _id: ObjectId("650c1f1e1c9d440000000008") });