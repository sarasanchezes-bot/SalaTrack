// ============================================================================
// SALATRACK - UNIDAD 2: MONGODB CRUD & DATO DE PRUEBA
// Autor: Pedro Watson
// Descripción: Script de inserción y operaciones CRUD adaptado al jsonSchema exacto de Juan
// ============================================================================

db = db.getSiblingDB("salatrack");

// ----------------------------------------------------------------------------
// 1. 20 INCIDENCIAS DE PRUEBA VALIDADAS ESTRICTAMENTE SEGÚN 01_colecciones_validacion.js
// ----------------------------------------------------------------------------
const incidenciasPrueba = [
  {
    _id: ObjectId("650c1f1e1c9d440000000001"),
    tipo: "hardware",
    descripcion: "Fallo crítico en tarjeta madre del equipo 1 durante la simulación.",
    severidad: "alta",
    estado: "abierta",
    fecha_reporte: ISODate("2026-10-01T08:30:00Z"),
    sala_id: 1,
    equipo_id: 1,
    curso: { curso_id: 1, codigo: "SIS-101", nombre: "Bases de Datos I" },
    reportado_por: { nombre: "Carlos Gómez", rol: "docente" },
    historial: [
      { estado: "abierta", fecha: ISODate("2026-10-01T08:30:00Z"), nota: "Reporte creado inicialmente" }
    ],
    detalle: { componente: "placa_base", sintoma: "No enciende y emite pitidos continuos" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000002"),
    tipo: "software",
    descripcion: "Error al iniciar entorno de desarrollo y conexión a base de datos.",
    severidad: "media",
    estado: "en_atencion",
    fecha_reporte: ISODate("2026-10-02T09:15:00Z"),
    sala_id: 1,
    equipo_id: 2,
    curso: { curso_id: 2, codigo: "RED-201", nombre: "Redes I" },
    reportado_por: { nombre: "Sara Sánchez", rol: "docente" },
    historial: [
      { estado: "abierta", fecha: ISODate("2026-10-02T09:15:00Z") },
      { estado: "en_atencion", fecha: ISODate("2026-10-02T10:00:00Z"), nota: "Asignado a técnico" }
    ],
    detalle: { software: { software_id: 1, nombre: "MySQL Workbench", version: "8.0" }, mensaje_error: "Connection refused on port 3306" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000003"),
    tipo: "permisos",
    descripcion: "Acceso denegado a carpetas compartidas del curso en el servidor.",
    severidad: "baja",
    estado: "cerrada",
    fecha_reporte: ISODate("2026-10-03T11:00:00Z"),
    sala_id: 2,
    equipo_id: 3,
    curso: { curso_id: 3, codigo: "ARQ-301", nombre: "Arquitectura" },
    reportado_por: { nombre: "Ana María Ríos", rol: "docente" },
    historial: [
      { estado: "abierta", fecha: ISODate("2026-10-03T11:00:00Z") },
      { estado: "cerrada", fecha: ISODate("2026-10-03T14:20:00Z"), nota: "Permisos actualizados" }
    ],
    detalle: { accion_bloqueada: "Lectura de directorio compartido", nivel_requerido: "estandar" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000004"),
    tipo: "hardware",
    descripcion: "Sobrecalentamiento crítico en procesador del equipo 4.",
    severidad: "alta",
    estado: "abierta",
    fecha_reporte: ISODate("2026-10-04T15:45:00Z"),
    sala_id: 3,
    equipo_id: 4,
    curso: { curso_id: 4, codigo: "SO-102", nombre: "Sistemas Operativos" },
    reportado_por: { nombre: "Juan Pérez", rol: "estudiante" },
    historial: [{ estado: "abierta", fecha: ISODate("2026-10-04T15:45:00Z") }],
    detalle: { componente: "ventilador", sintoma: "Ruido excesivo y apagado térmico" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000005"),
    tipo: "hardware",
    descripcion: "Puerto de red dañado físicamente en el puesto 5 de la sala 2.",
    severidad: "media",
    estado: "en_atencion",
    fecha_reporte: ISODate("2026-10-05T07:45:00Z"),
    sala_id: 2,
    equipo_id: 5,
    curso: { curso_id: 5, codigo: "TEL-202", nombre: "Telecomunicaciones" },
    reportado_por: { nombre: "Mario Castaño", rol: "docente" },
    historial: [{ estado: "en_atencion", fecha: ISODate("2026-10-05T07:45:00Z") }],
    detalle: { componente: "puerto_rj45", sintoma: "Sin enlace de red físico por pin roto" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000006"),
    tipo: "software",
    descripcion: "Falta licencia de software compilador en equipo 6.",
    severidad: "baja",
    estado: "cerrada",
    fecha_reporte: ISODate("2026-10-06T12:00:00Z"),
    sala_id: 3,
    equipo_id: 6,
    curso: { curso_id: 6, codigo: "PRG-101", nombre: "Programación I" },
    reportado_por: { nombre: "Luis Soto", rol: "estudiante" },
    historial: [{ estado: "cerrada", fecha: ISODate("2026-10-06T12:00:00Z") }],
    detalle: { software: { software_id: 2, nombre: "GCC Compiler", version: "12.2" }, mensaje_error: "License key not found" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000007"),
    tipo: "permisos",
    descripcion: "Sin privilegios suficientes para ejecutar script de pruebas en base de datos.",
    severidad: "alta",
    estado: "abierta",
    fecha_reporte: ISODate("2026-10-07T14:10:00Z"),
    sala_id: 1,
    equipo_id: 1,
    curso: { curso_id: 1, codigo: "SIS-101", nombre: "Bases de Datos I" },
    reportado_por: { nombre: "Sara Sánchez", rol: "docente" },
    historial: [{ estado: "abierta", fecha: ISODate("2026-10-07T14:10:00Z") }],
    detalle: { accion_bloqueada: "Ejecución de script root", nivel_requerido: "administrador" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000008"),
    tipo: "hardware",
    descripcion: "Falla en conector de alimentación del equipo 2 de sala 3.",
    severidad: "media",
    estado: "cerrada",
    fecha_reporte: ISODate("2026-10-08T16:30:00Z"),
    sala_id: 3,
    equipo_id: 2,
    curso: { curso_id: 6, codigo: "PRG-101", nombre: "Programación I" },
    reportado_por: { nombre: "Pedro Watson", rol: "estudiante" },
    historial: [{ estado: "cerrada", fecha: ISODate("2026-10-08T16:30:00Z") }],
    detalle: { componente: "fuente_poder", sintoma: "Apagones intermitentes por cable flojo" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000009"),
    tipo: "hardware",
    descripcion: "Pantalla sin señal de video en equipo 3 de sala 2.",
    severidad: "critica",
    estado: "en_atencion",
    fecha_reporte: ISODate("2026-10-09T08:00:00Z"),
    sala_id: 2,
    equipo_id: 3,
    curso: { curso_id: 7, codigo: "HW-101", nombre: "Hardware" },
    reportado_por: { nombre: "Carlos Gómez", rol: "docente" },
    historial: [{ estado: "en_atencion", fecha: ISODate("2026-10-09T08:00:00Z") }],
    detalle: { componente: "gpu_integrada", sintoma: "Monitor en modo ahorro de energía sin señal" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000010"),
    tipo: "software",
    descripcion: "Reproductor multimedia con codecs dañados en equipo 4 sala 1.",
    severidad: "baja",
    estado: "abierta",
    fecha_reporte: ISODate("2026-10-10T10:20:00Z"),
    sala_id: 1,
    equipo_id: 4,
    curso: { curso_id: 8, codigo: "ING-101", nombre: "Inglés" },
    reportado_por: { nombre: "Laura Ospina", rol: "estudiante" },
    historial: [{ estado: "abierta", fecha: ISODate("2026-10-10T10:20:00Z") }],
    detalle: { software: { software_id: 3, nombre: "VLC Player", version: "3.0" }, mensaje_error: "Missing audio codec h264" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000011"),
    tipo: "software",
    descripcion: "Fallo en actualización de sistema operativo en sala 3 equipo 5.",
    severidad: "media",
    estado: "en_atencion",
    fecha_reporte: ISODate("2026-10-11T13:45:00Z"),
    sala_id: 3,
    equipo_id: 5,
    curso: { curso_id: 4, codigo: "SO-102", nombre: "Sistemas Operativos" },
    reportado_por: { nombre: "Fernando Ruiz", rol: "docente" },
    historial: [{ estado: "en_atencion", fecha: ISODate("2026-10-11T13:45:00Z") }],
    detalle: { software: { software_id: 4, nombre: "Windows Update", version: "11" }, mensaje_error: "Error 0x80070002" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000012"),
    tipo: "hardware",
    descripcion: "Unidad de almacenamiento con errores SMART en equipo 6 sala 1.",
    severidad: "alta",
    estado: "abierta",
    fecha_reporte: ISODate("2026-10-12T15:00:00Z"),
    sala_id: 1,
    equipo_id: 6,
    curso: { curso_id: 1, codigo: "SIS-101", nombre: "Bases de Datos I" },
    reportado_por: { nombre: "Juan Pérez", rol: "estudiante" },
    historial: [{ estado: "abierta", fecha: ISODate("2026-10-12T15:00:00Z") }],
    detalle: { componente: "ssd_nvme", sintoma: "Advertencia de fallo inminente en BIOS" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000013"),
    tipo: "software",
    descripcion: "Librería de IA desactualizada en equipo 1 sala 2.",
    severidad: "baja",
    estado: "cerrada",
    fecha_reporte: ISODate("2026-10-13T09:00:00Z"),
    sala_id: 2,
    equipo_id: 1,
    curso: { curso_id: 9, codigo: "IA-401", nombre: "Inteligencia Artificial" },
    reportado_por: { nombre: "Sara Sánchez", rol: "docente" },
    historial: [{ estado: "cerrada", fecha: ISODate("2026-10-13T09:00:00Z") }],
    detalle: { software: { software_id: 5, nombre: "Anaconda Python", version: "2023" }, mensaje_error: "Package version mismatch" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000014"),
    tipo: "hardware",
    descripcion: "Fallo en puertos USB frontales en equipo 2 sala 3.",
    severidad: "media",
    estado: "abierta",
    fecha_reporte: ISODate("2026-10-14T11:15:00Z"),
    sala_id: 3,
    equipo_id: 2,
    curso: { curso_id: 10, codigo: "FIS-101", nombre: "Física" },
    reportado_por: { nombre: "Ana María Ríos", rol: "docente" },
    historial: [{ estado: "abierta", fecha: ISODate("2026-10-14T11:15:00Z") }],
    detalle: { componente: "hub_usb", sintoma: "Dispositivos USB no reconocidos" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000015"),
    tipo: "software",
    descripcion: "Error de renderizado en software gráfico en equipo 3 sala 2.",
    severidad: "baja",
    estado: "cerrada",
    fecha_reporte: ISODate("2026-10-15T14:50:00Z"),
    sala_id: 2,
    equipo_id: 3,
    curso: { curso_id: 11, codigo: "MUL-201", nombre: "Multimedia" },
    reportado_por: { nombre: "Pedro Watson", rol: "estudiante" },
    historial: [{ estado: "cerrada", fecha: ISODate("2026-10-15T14:50:00Z") }],
    detalle: { software: { software_id: 6, nombre: "Blender", version: "3.6" }, mensaje_error: "CUDA driver version unsupported" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000016"),
    tipo: "permisos",
    descripcion: "Restricción de ejecución en sandbox de seguridad en equipo 4 sala 1.",
    severidad: "alta",
    estado: "cerrada",
    fecha_reporte: ISODate("2026-10-16T16:00:00Z"),
    sala_id: 1,
    equipo_id: 4,
    curso: { curso_id: 12, codigo: "SEC-302", nombre: "Ciberseguridad" },
    reportado_por: { nombre: "Mario Castaño", rol: "docente" },
    historial: [{ estado: "cerrada", fecha: ISODate("2026-10-16T16:00:00Z") }],
    detalle: { accion_bloqueada: "Escritura en system32", nivel_requerido: "restringido" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000017"),
    tipo: "hardware",
    descripcion: "Teclado con teclas trabadas en equipo 5 sala 2.",
    severidad: "baja",
    estado: "abierta",
    fecha_reporte: ISODate("2026-10-17T08:45:00Z"),
    sala_id: 2,
    equipo_id: 5,
    curso: { curso_id: 6, codigo: "PRG-101", nombre: "Programación I" },
    reportado_por: { nombre: "Laura Ospina", rol: "estudiante" },
    historial: [{ estado: "abierta", fecha: ISODate("2026-10-17T08:45:00Z") }],
    detalle: { componente: "teclado", sintoma: "Tecla espacio atascada físicamente" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000018"),
    tipo: "software",
    descripcion: "Entorno de máquina virtual corrupto en equipo 6 sala 3.",
    severidad: "media",
    estado: "en_atencion",
    fecha_reporte: ISODate("2026-10-18T10:30:00Z"),
    sala_id: 3,
    equipo_id: 6,
    curso: { curso_id: 12, codigo: "SEC-302", nombre: "Ciberseguridad" },
    reportado_por: { nombre: "Carlos Gómez", rol: "docente" },
    historial: [{ estado: "en_atencion", fecha: ISODate("2026-10-18T10:30:00Z") }],
    detalle: { software: { software_id: 7, nombre: "VirtualBox", version: "7.0" }, mensaje_error: "VT-x/AMD-V hardware acceleration is not available" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000019"),
    tipo: "software",
    descripcion: "Llenado de espacio temporal en disco en equipo 1 sala 1.",
    severidad: "baja",
    estado: "abierta",
    fecha_reporte: ISODate("2026-10-19T13:10:00Z"),
    sala_id: 1,
    equipo_id: 1,
    curso: { curso_id: 4, codigo: "SO-102", nombre: "Sistemas Operativos" },
    reportado_por: { nombre: "Juan Pérez", rol: "estudiante" },
    historial: [{ estado: "abierta", fecha: ISODate("2026-10-19T13:10:00Z") }],
    detalle: { software: { software_id: 8, nombre: "Windows Temp Manager", version: "1.0" }, mensaje_error: "Disk full warning" }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000020"),
    tipo: "hardware",
    descripcion: "Fallo de enlace en tarjeta de red en equipo 2 sala 2.",
    severidad: "alta",
    estado: "cerrada",
    fecha_reporte: ISODate("2026-10-20T17:00:00Z"),
    sala_id: 2,
    equipo_id: 2,
    curso: { curso_id: 2, codigo: "RED-201", nombre: "Redes I" },
    reportado_por: { nombre: "Sara Sánchez", rol: "docente" },
    historial: [{ estado: "cerrada", fecha: ISODate("2026-10-20T17:00:00Z") }],
    detalle: { componente: "tarjeta_nic", sintoma: "Led de red apagado y sin link físico" }
  }
];

// Inserción sin drop()
db.incidencias.insertMany(incidenciasPrueba);
print("-> 20 incidencias validadas estrictamente insertadas correctamente.");

// ----------------------------------------------------------------------------
// 2. 6 OPERACIONES CRUD OBLIGATORIAS
// ----------------------------------------------------------------------------

// COMANDO 1: insertOne
db.incidencias.insertOne({
  tipo: "hardware",
  descripcion: "Prueba de inserción unitaria de hardware en puerto serie.",
  severidad: "alta",
  estado: "abierta",
  fecha_reporte: new Date(),
  sala_id: 1,
  equipo_id: 3,
  curso: { curso_id: 1, codigo: "SIS-101", nombre: "Bases de Datos I" },
  reportado_por: { nombre: "Pedro Watson", rol: "estudiante" },
  historial: [{ estado: "abierta", fecha: new Date() }],
  detalle: { componente: "puerto_com", sintoma: "Fallo de comunicación serial en COM1" }
});

// COMANDO 2: insertMany
db.incidencias.insertMany([
  {
    tipo: "software",
    descripcion: "Prueba de lote 1 de software con certificado SSL vencido.",
    severidad: "media",
    estado: "abierta",
    fecha_reporte: new Date(),
    sala_id: 2,
    equipo_id: 4,
    curso: { curso_id: 2, codigo: "RED-201", nombre: "Redes I" },
    reportado_por: { nombre: "Soporte Técnico", rol: "docente" },
    historial: [{ estado: "abierta", fecha: new Date() }],
    detalle: { software: { software_id: 9, nombre: "Browser SSL", version: "Latest" }, mensaje_error: "Certificate expired error" }
  },
  {
    tipo: "hardware",
    descripcion: "Prueba de lote 2 de hardware con batería CMOS baja.",
    severidad: "baja",
    estado: "abierta",
    fecha_reporte: new Date(),
    sala_id: 3,
    equipo_id: 5,
    curso: { curso_id: 7, codigo: "HW-101", nombre: "Hardware" },
    reportado_por: { nombre: "Soporte Técnico", rol: "docente" },
    historial: [{ estado: "abierta", fecha: new Date() }],
    detalle: { componente: "cmos_battery", sintoma: "Reloj del sistema desconfigurado al reiniciar" }
  }
]);

// COMANDO 3: find (con filtros y proyección)
db.incidencias.find(
  { sala_id: 1, tipo: "hardware" },
  { descripcion: 1, equipo_id: 1, estado: 1, _id: 0 }
);

// COMANDO 4: updateOne
db.incidencias.updateOne(
  { _id: ObjectId("650c1f1e1c9d440000000001") },
  {
    $set: { estado: "en_atencion" },
    $push: { historial: { estado: "en_atencion", fecha: new Date(), nota: "Actualizado a en_atencion por CRUD" } }
  }
);

// COMANDO 5: updateMany
db.incidencias.updateMany(
  { estado: "abierta" },
  {
    $set: { revision_tecnica: true },
    $push: { historial: { estado: "abierta", fecha: new Date(), nota: "Revisión masiva en jornada técnica" } }
  }
);

// COMANDO 6: deleteOne
db.incidencias.deleteOne({ _id: ObjectId("650c1f1e1c9d440000000008") });