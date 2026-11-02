// ============================================================
// SalaTrack - Unidad 2 (MongoDB)
// Seis incidencias minimas para probar las consultas
// ============================================================
// Esto NO reemplaza los datos de prueba de la entrega: son solo
// seis documentos bien formados para poder correr consultas.js
// antes de que esten cargados los definitivos.
//
// Cumplen el validador de mongodb/esquema/01_colecciones_validacion.js
// y usan unicamente ids que existen en SQL Server:
//   salas  1, 2, 3     equipos 1-2 (sala 1), 3-4 (sala 2), 5-6 (sala 3)
//   cursos 1-4         software 1-5
//
// Uso:
//   mongosh "mongodb://localhost:27017" --file mongodb/datos_prueba_minimos.js
// ============================================================

db = db.getSiblingDB("salatrack");

db.incidencias.insertMany([
  {
    tipo: "software",
    descripcion: "SQL Server no acepta conexiones por TCP durante la clase.",
    severidad: "alta",
    estado: "abierta",
    impacto_clase: "total",
    fecha_reporte: ISODate("2026-10-05T08:00:00Z"),
    sala_id: 1,
    equipo_id: 1,
    curso: { curso_id: 1, codigo: "ISLPE04", nombre: "BASE DE DATOS AVANZADA (LINEA PROF. I)" },
    reportado_por: { nombre: "Sara Sanchez", rol: "estudiante" },
    detalle: {
      software: { software_id: 1, nombre: "SQL Server 2022", version: "16.0" },
      mensaje_error: "No se pudo establecer la conexion con el servidor.",
      reproducible: true
    },
    historial: [
      { estado: "abierta", fecha: ISODate("2026-10-05T08:00:00Z"), por: "Sara Sanchez" }
    ]
  },
  {
    tipo: "permisos",
    descripcion: "No se puede habilitar el protocolo TCP por falta de permisos.",
    severidad: "critica",
    estado: "en_atencion",
    impacto_clase: "total",
    fecha_reporte: ISODate("2026-10-06T10:15:00Z"),
    sala_id: 1,
    equipo_id: 2,
    curso: { curso_id: 1, codigo: "ISLPE04", nombre: "BASE DE DATOS AVANZADA (LINEA PROF. I)" },
    reportado_por: { nombre: "Carlos Mejia", rol: "docente" },
    detalle: {
      software: { software_id: 1, nombre: "SQL Server 2022", version: "16.0" },
      accion_bloqueada: "Habilitar TCP/IP en el administrador de configuracion",
      nivel_actual: "restringido",
      nivel_requerido: "administrador"
    },
    atencion: { fecha_limite: ISODate("2026-10-13T10:00:00Z"), tecnico_id: 1, tecnico_nombre: "Carlos Perez" },
    historial: [
      { estado: "abierta", fecha: ISODate("2026-10-06T10:15:00Z"), por: "Carlos Mejia" },
      { estado: "en_atencion", fecha: ISODate("2026-10-07T09:00:00Z"), por: "Carlos Perez", nota: "Escalado a sistemas." }
    ]
  },
  {
    tipo: "hardware",
    descripcion: "El equipo se apaga solo a los pocos minutos de encenderlo.",
    severidad: "media",
    estado: "cerrada",
    impacto_clase: "parcial",
    fecha_reporte: ISODate("2026-10-08T14:30:00Z"),
    sala_id: 1,
    equipo_id: 1,
    curso: { curso_id: 2, codigo: "ISLPE05", nombre: "INTELIGENCIA ARTIFICIAL (LINEA PROF. II)" },
    reportado_por: { nombre: "Laura Restrepo", rol: "estudiante" },
    detalle: { componente: "fuente de poder", sintoma: "apagado intermitente", enciende: true },
    atencion: {
      tecnico_id: 2,
      tecnico_nombre: "Ana Maria Gomez",
      fecha_cierre: ISODate("2026-10-09T11:00:00Z"),
      solucion: "Se reemplazo la fuente de poder."
    },
    historial: [
      { estado: "abierta", fecha: ISODate("2026-10-08T14:30:00Z"), por: "Laura Restrepo" },
      { estado: "cerrada", fecha: ISODate("2026-10-09T11:00:00Z"), por: "Ana Maria Gomez" }
    ]
  },
  {
    tipo: "software",
    descripcion: "Python no tiene instaladas las librerias que pide la practica.",
    severidad: "media",
    estado: "abierta",
    impacto_clase: "parcial",
    fecha_reporte: ISODate("2026-10-12T16:00:00Z"),
    sala_id: 2,
    equipo_id: 3,
    curso: { curso_id: 2, codigo: "ISLPE05", nombre: "INTELIGENCIA ARTIFICIAL (LINEA PROF. II)" },
    reportado_por: { nombre: "Juan Sanchez", rol: "estudiante" },
    detalle: {
      software: { software_id: 3, nombre: "Python", version: "3.12" },
      mensaje_error: "ModuleNotFoundError: No module named pandas",
      reproducible: true
    },
    historial: [
      { estado: "abierta", fecha: ISODate("2026-10-12T16:00:00Z"), por: "Juan Sanchez" }
    ]
  },
  {
    tipo: "software",
    descripcion: "SQL Server pide activacion de licencia al abrirlo en esta sala.",
    severidad: "alta",
    estado: "abierta",
    impacto_clase: "total",
    fecha_reporte: ISODate("2026-10-14T07:45:00Z"),
    sala_id: 2,
    equipo_id: 4,
    curso: { curso_id: 1, codigo: "ISLPE04", nombre: "BASE DE DATOS AVANZADA (LINEA PROF. I)" },
    reportado_por: { nombre: "Carlos Mejia", rol: "docente" },
    detalle: {
      software: { software_id: 1, nombre: "SQL Server 2022", version: "16.0" },
      mensaje_error: "El periodo de evaluacion ha expirado.",
      reproducible: true
    },
    historial: [
      { estado: "abierta", fecha: ISODate("2026-10-14T07:45:00Z"), por: "Carlos Mejia" }
    ]
  },
  {
    tipo: "hardware",
    descripcion: "El teclado del equipo no responde en varias teclas.",
    severidad: "baja",
    estado: "abierta",
    impacto_clase: "ninguno",
    fecha_reporte: ISODate("2026-10-16T09:20:00Z"),
    sala_id: 3,
    equipo_id: 5,
    curso: { curso_id: 3, codigo: "ISSAE05", nombre: "SEGURIDAD INFORMATICA (SEM. ACTUALIZACION II)" },
    reportado_por: { nombre: "Laura Restrepo", rol: "estudiante" },
    detalle: { componente: "teclado", sintoma: "teclas sin respuesta", enciende: true },
    historial: [
      { estado: "abierta", fecha: ISODate("2026-10-16T09:20:00Z"), por: "Laura Restrepo" }
    ]
  }
]);

print("Insertadas " + db.incidencias.countDocuments() + " incidencias en total.");
