// ============================================================================
// SALATRACK - UNIDAD 2: MONGODB CRUD & DATO DE PRUEBA
// Autor: Pedro Watson
// Descripción: Scripts de inserción y operaciones CRUD para la colección 'incidencias'
// ============================================================================

// Seleccionar o crear la base de datos de SalaTrack en Mongosh / Node.js
use salatrack;

// ----------------------------------------------------------------------------
// 1. DATO DE PRUEBA: 20 INCIDENCIAS CON ESTRUCTURA DOCUMENTAL FLEXIBLE
// ----------------------------------------------------------------------------
const incidenciasPrueba = [
  {
    _id: ObjectId("650c1f1e1c9d440000000001"),
    sala_id: 1,
    equipo_id: 101,
    reportado_por: "Prof. Carlos Gómez",
    fecha_reporte: ISODate("2026-10-01T08:30:00Z"),
    titulo: "Pantalla azul recurrente al abrir MATLAB",
    descripcion: "El equipo 101 de la Sala 1 se reinicia inesperadamente al ejecutar simulaciones complejas.",
    estado: "abierta",
    prioridad: "alta",
    categoria: "hardware",
    etiquetas: ["matlab", "pantalla_azul", "memoria_ram"],
    adjuntos: [
      { nombre: "error_log.txt", URL: "https://storage.salatrack.edu/logs/err_101.txt" },
      { nombre: "foto_pantalla.jpg", URL: "https://storage.salatrack.edu/img/bsod_101.jpg" }
    ]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000002"),
    sala_id: 1,
    equipo_id: 105,
    reportado_por: "Sara Sánchez",
    fecha_reporte: ISODate("2026-10-02T09:15:00Z"),
    titulo: "Teclado sin respuesta en conector USB frontal",
    descripcion: "Varias teclas no registran pulsación en la terminal 105.",
    estado: "en_proceso",
    prioridad: "media",
    tecnico_asignado: {
      tecnico_id: 3,
      nombre: "Luis Martínez",
      fecha_asignacion: ISODate("2026-10-02T10:00:00Z")
    },
    historial_notas: [
      { fecha: ISODate("2026-10-02T10:30:00Z"), autor: "Luis Martínez", texto: "Se probó con periférico de reemplazo." }
    ]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000003"),
    sala_id: 2,
    equipo_id: 202,
    reportado_por: "Prof. Ana María Ríos",
    fecha_reporte: ISODate("2026-10-03T11:00:00Z"),
    titulo: "Licencia caducada en Cisco Packet Tracer",
    descripcion: "El software solicita autenticación de cuenta no registrada.",
    estado: "resuelta",
    prioridad: "baja",
    solucion: {
      fecha_resolucion: ISODate("2026-10-03T14:20:00Z"),
      tecnico: "Pedro Watson",
      accion_realizada: "Reinstalación de paquete de licencias de laboratorio."
    },
    costo_reparacion: 0.00
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000004"),
    sala_id: 3,
    equipo_id: 304,
    reportado_por: "Juan Pérez",
    fecha_reporte: ISODate("2026-10-04T15:45:00Z"),
    titulo: "Filtro de polvo obstruido causando sobrecalentamiento",
    descripcion: "El cooler del procesador suena ruidoso y baja la frecuencia de reloj.",
    estado: "abierta",
    prioridad: "media",
    mantenimiento_preventivo: true,
    sensor_temperatura_max: 92.5
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000005"),
    sala_id: 2,
    equipo_id: 210,
    reportado_por: "Prof. Mario Castaño",
    fecha_reporte: ISODate("2026-10-05T07:45:00Z"),
    titulo: "Sin conexión a la red cableada (VLAN Docencia)",
    descripcion: "El puerto RJ45 del equipo no levanta enlace ni asigna IP por DHCP.",
    estado: "en_proceso",
    prioridad: "alta",
    direccion_mac: "00:1A:2B:3C:4D:5E",
    red_afectada: "VLAN_10_SALA2"
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000006"),
    sala_id: 4,
    equipo_id: 401,
    reportado_por: "Sistemas Central",
    fecha_reporte: ISODate("2026-10-06T12:00:00Z"),
    titulo: "Monitor presenta parpadeo vertical",
    descripcion: "El cable HDMI del puesto 401 tiene un pin doblado.",
    estado: "resuelta",
    prioridad: "baja",
    costo_reparacion: 35000.00,
    repuesto_utilizado: "Cable HDMI 2.0 1.8m"
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000007"),
    sala_id: 1,
    equipo_id: 112,
    reportado_por: "Sara Sánchez",
    fecha_reporte: ISODate("2026-10-07T14:10:00Z"),
    titulo: "Falta cliente MySQL Workbench",
    descripcion: "No está instalada la versión 8.0 requerida para la clase de Bases de Datos.",
    estado: "abierta",
    prioridad: "alta",
    curso_relacionado: "Bases de Datos I",
    software_solicitado: "MySQL Workbench 8.0.34"
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000008"),
    sala_id: 3,
    equipo_id: 315,
    reportado_por: "Pedro Watson",
    fecha_reporte: ISODate("2026-10-08T16:30:00Z"),
    titulo: "Mouse óptico con sensor descalibrado",
    descripcion: "El cursor salta erráticamente al mover el ratón.",
    estado: "cerrada",
    prioridad: "baja",
    reemplazo_inmediato: true,
    serial_nuevo_periferico: "MS-LOG-2026-998"
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000009"),
    sala_id: 2,
    equipo_id: 205,
    reportado_por: "Prof. Carlos Gómez",
    fecha_reporte: ISODate("2026-10-09T08:00:00Z"),
    titulo: "Falla general de arranque (No POST)",
    descripcion: "El equipo emite 3 pitidos largos y no da video al encender.",
    estado: "en_proceso",
    prioridad: "critica",
    tecnico_asignado: { tecnico_id: 1, nombre: "Andrés Silva" },
    diagnostico_hardware: "Fallo en el módulo 1 de memoria RAM DDR4 8GB."
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000010"),
    sala_id: 5,
    equipo_id: 502,
    reportado_por: "Laura Ospina",
    fecha_reporte: ISODate("2026-10-10T10:20:00Z"),
    titulo: "Audífonos de laboratorio con canal izquierdo dañado",
    descripcion: "No hay salida de audio en el canal izquierdo durante la clase de inglés.",
    estado: "abierta",
    prioridad: "baja",
    etiquetas: ["audio", "perifericos", "ingles"]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000011"),
    sala_id: 4,
    equipo_id: 410,
    reportado_por: "Prof. Fernando Ruiz",
    fecha_reporte: ISODate("2026-10-11T13:45:00Z"),
    titulo: "Actualización fallida de Windows Update",
    descripcion: "El sistema intenta revertir cambios en cada ciclo de inicio.",
    estado: "en_proceso",
    tiempo_estimado_horas: 2.5
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000012"),
    sala_id: 1,
    equipo_id: 108,
    reportado_por: "Juan Pérez",
    fecha_reporte: ISODate("2026-10-12T15:00:00Z"),
    titulo: "Disco duro con sectores defectuosos (S.M.A.R.T Error)",
    descripcion: "La bios arroja advertencia de fallo inminente en SSD 240GB.",
    estado: "abierta",
    prioridad: "critica",
    requiere_backup: true,
    capacidad_disco: "240GB SSD"
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000013"),
    sala_id: 3,
    equipo_id: 301,
    reportado_por: "Sara Sánchez",
    fecha_reporte: ISODate("2026-10-13T09:00:00Z"),
    titulo: "Incompatibilidad de versión de Python en Anaconda",
    descripcion: "Los scripts de Inteligencia Artificial requieren Python 3.11 y está la versión 3.8.",
    estado: "resuelta",
    prioridad: "alta",
    solucion: {
      fecha_resolucion: ISODate("2026-10-13T11:30:00Z"),
      tecnico: "Luis Martínez",
      accion_realizada: "Creación de ambiente conda 'env_ia_311'."
    }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000014"),
    sala_id: 5,
    equipo_id: 512,
    reportado_por: "Prof. Ana María Ríos",
    fecha_reporte: ISODate("2026-10-14T11:15:00Z"),
    titulo: "Toma eléctrica de pared suelta",
    descripcion: "El cable de energía del PC 512 se desconecta con el movimiento del escritorio.",
    estado: "abierta",
    prioridad: "alta",
    requiere_infraestructura: true,
    bloque_ubicacion: "Bloque B - Piso 2"
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000015"),
    sala_id: 2,
    equipo_id: 208,
    reportado_por: "Pedro Watson",
    fecha_reporte: ISODate("2026-10-15T14:50:00Z"),
    titulo: "Configuración de resolución incorrecta en proyector",
    descripcion: "La pantalla duplicada no ajusta a la relación de aspecto 16:9.",
    estado: "resuelta",
    prioridad: "media",
    solucion: {
      fecha_resolucion: ISODate("2026-10-15T15:10:00Z"),
      tecnico: "Pedro Watson",
      accion_realizada: "Reconfiguración de controladores de la tarjeta gráfica integrada."
    }
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000016"),
    sala_id: 4,
    equipo_id: 405,
    reportado_por: "Prof. Mario Castaño",
    fecha_reporte: ISODate("2026-10-16T16:00:00Z"),
    titulo: "Infección por malware simulado en práctica de Ciberseguridad",
    descripcion: "Un alumno ejecutó un payload sin aislar en la máquina virtual.",
    estado: "cerrada",
    prioridad: "alta",
    historial_notas: [
      { fecha: ISODate("2026-10-16T16:20:00Z"), autor: "Andrés Silva", texto: "Máquina aislada de la VLAN." },
      { fecha: ISODate("2026-10-16T17:00:00Z"), autor: "Andrés Silva", texto: "Restauración desde imagen base limpia." }
    ]
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000017"),
    sala_id: 1,
    equipo_id: 115,
    reportado_por: "Laura Ospina",
    fecha_reporte: ISODate("2026-10-17T08:45:00Z"),
    titulo: "Silla ergonómica de la estación averiada",
    descripcion: "El pistón hidráulico no mantiene la altura fijada.",
    estado: "abierta",
    prioridad: "baja",
    tipo_elemento: "mobiliario"
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000018"),
    sala_id: 3,
    equipo_id: 308,
    reportado_por: "Prof. Carlos Gómez",
    fecha_reporte: ISODate("2026-10-18T10:30:00Z"),
    titulo: "Lector de huella biológico deshabilitado",
    descripcion: "El driver del sensor biométrico no carga al iniciar la sesión de docente.",
    estado: "en_proceso",
    prioridad: "media",
    driver_version: "v2.1.0-deprecated"
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000019"),
    sala_id: 2,
    equipo_id: 215,
    reportado_por: "Juan Pérez",
    fecha_reporte: ISODate("2026-10-19T13:10:00Z"),
    titulo: "Falta de espacio en disco C:",
    descripcion: "Quedan menos de 500 MB libres debido al almacenamiento temporal de archivos de usuarios.",
    estado: "abierta",
    prioridad: "alta",
    espacio_libre_mb: 450
  },
  {
    _id: ObjectId("650c1f1e1c9d440000000020"),
    sala_id: 5,
    equipo_id: 501,
    reportado_por: "Sara Sánchez",
    fecha_reporte: ISODate("2026-10-20T17:00:00Z"),
    titulo: "Cable de red sin pestillo de seguridad",
    descripcion: "El conector RJ45 se zafa fácilmente al mover el computador.",
    estado: "resuelta",
    prioridad: "baja",
    solucion: {
      fecha_resolucion: ISODate("2026-10-21T08:30:00Z"),
      tecnico: "Luis Martínez",
      accion_realizada: "Crimpado de nuevo conector RJ45 Cat6."
    }
  }
];

// Limpiar la colección si existe previamente e insertar los 20 documentos
db.incidencias.drop();
db.incidencias.insertMany(incidenciasPrueba);

console.log("-> 20 incidencias de prueba insertadas correctamente.");

// ============================================================================
// 2. SEIS OPERACIONES CRUD OBLIGATORIAS (CON EXPLICACIÓN DETALLADA)
// ============================================================================

// ----------------------------------------------------------------------------
// COMANDO 1: insertOne
// Descripción: Inserta un nuevo documento de incidencia individual en la colección.
// ----------------------------------------------------------------------------
db.incidencias.insertOne({
  sala_id: 1,
  equipo_id: 120,
  reportado_por: "Pedro Watson",
  fecha_reporte: new Date(),
  titulo: "Fallo de comunicación en puerto COM2",
  descripcion: "Incidencia individual agregada para probar la operación insertOne.",
  estado: "abierta",
  prioridad: "alta",
  etiquetas: ["serial", "hardware_testing"]
});

// ----------------------------------------------------------------------------
// COMANDO 2: insertMany
// Descripción: Inserta un arreglo de múltiples documentos en una sola operación.
// ----------------------------------------------------------------------------
db.incidencias.insertMany([
  {
    sala_id: 4,
    equipo_id: 420,
    reportado_por: "Sistemas Auxiliar",
    fecha_reporte: new Date(),
    titulo: "Error de certificado SSL en navegador",
    descripcion: "Lote de prueba - Registro 1",
    estado: "abierta",
    prioridad: "media"
  },
  {
    sala_id: 4,
    equipo_id: 421,
    reportado_por: "Sistemas Auxiliar",
    fecha_reporte: new Date(),
    titulo: "Reloj del sistema desconfigurado (Pila CMOS)",
    descripcion: "Lote de prueba - Registro 2",
    estado: "abierta",
    prioridad: "baja"
  }
]);

// ----------------------------------------------------------------------------
// COMANDO 3: find (con filtros)
// Descripción: Consulta y filtra las incidencias según criterios específicos 
// (en este caso, incidencias de prioridad 'alta' o 'critica' en la Sala 1).
// ----------------------------------------------------------------------------
db.incidencias.find(
  {
    sala_id: 1,
    prioridad: { $in: ["alta", "critica"] }
  },
  {
    titulo: 1,
    equipo_id: 1,
    prioridad: 1,
    estado: 1,
    _id: 0
  }
);

// ----------------------------------------------------------------------------
// COMANDO 4: updateOne
// Descripción: Actualiza un único documento que coincida con la condición de búsqueda.
// Asigna un técnico y cambia el estado a 'en_proceso' para la incidencia 1.
// ----------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------
// COMANDO 5: updateMany
// Descripción: Modifica múltiples documentos a la vez. En este caso, añade una 
// nota de revisión general a todas las incidencias que están en estado 'abierta'.
// ----------------------------------------------------------------------------
db.incidencias.updateMany(
  { estado: "abierta" },
  {
    $set: { revisado_en_mantenimiento: true },
    $push: {
      historial_notas: {
        fecha: new Date(),
        autor: "Sistema Automático",
        texto: "Incidencia marcada para revisión en jornada técnica."
      }
    }
  }
);

// ----------------------------------------------------------------------------
// COMANDO 6: deleteOne
// Descripción: Elimina un único documento específico de la colección basado en un filtro.
// ----------------------------------------------------------------------------
db.incidencias.deleteOne({ _id: ObjectId("650c1f1e1c9d440000000008") });