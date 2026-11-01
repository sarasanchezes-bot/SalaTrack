// 
// SalaTrack (Unidad 2)
// Pruebas de la validación de esquema
// 
// Inserta documentos válidos e inválidos en una colección temporal que se usa
// el mismo validador que 'incidencias', y muestra cuáles acepta y cuáles
// rechaza MongoDB. Al final se borra la colección temporal.
//
// Un requisito: haber ejecutado antes 01_colecciones_validacion.js
// Uso:
//   mongosh "mongodb://localhost:27017" --file mongodb/esquema/03_pruebas_validacion.js
// 

db = db.getSiblingDB("salatrack");

const info = db.getCollectionInfos({ name: "incidencias" })[0];
if (!info || !info.options || !info.options.validator) {
  throw new Error("Primero ejecuta 01_colecciones_validacion.js: la coleccion incidencias no tiene validador.");
}

const TMP = "tmp_validacion_incidencias";
db.getCollection(TMP).drop();
db.createCollection(TMP, { validator: info.options.validator, validationLevel: "strict", validationAction: "error" });
const coleccion = db.getCollection(TMP);

const ahora = ISODate("2026-10-05T14:30:00Z");

// ---------- Documentos base (uno por tipo) ----------
function incidenciaHardware() {
  return {
    tipo: "hardware",
    descripcion: "El equipo no enciende al iniciar la clase",
    severidad: "alta",
    estado: "abierta",
    impacto_clase: "parcial",
    fecha_reporte: ahora,
    sala_id: 1,
    equipo_id: 2,
    curso: { curso_id: 1, codigo: "ISLPE04", nombre: "BASE DE DATOS AVANZADA (LINEA PROF. I)" },
    reportado_por: { nombre: "Camila Torres", rol: "estudiante" },
    detalle: { componente: "fuente de poder", sintoma: "no enciende", enciende: false },
    historial: [{ estado: "abierta", fecha: ahora, por: "Camila Torres" }]
  };
}

function incidenciaSoftware() {
  return {
    tipo: "software",
    descripcion: "SQL Server no permite conexiones desde otro equipo",
    severidad: "media",
    estado: "en_atencion",
    fecha_reporte: ahora,
    sala_id: 1,
    equipo_id: 1,
    curso: { curso_id: 1, codigo: "ISLPE04", nombre: "BASE DE DATOS AVANZADA (LINEA PROF. I)" },
    reportado_por: { nombre: "Carlos Perez", rol: "docente" },
    detalle: {
      software: { software_id: 1, nombre: "SQL Server 2022", version: "16.0" },
      mensaje_error: "Error 53: no se pudo abrir una conexion",
      reproducible: true
    },
    atencion: { fecha_limite: ISODate("2026-10-08T12:00:00Z"), tecnico_id: 1, tecnico_nombre: "Carlos Perez" },
    historial: [
      { estado: "abierta", fecha: ahora, por: "Carlos Perez" },
      { estado: "en_atencion", fecha: ISODate("2026-10-05T16:00:00Z"), por: "Carlos Perez" }
    ]
  };
}

function incidenciaPermisos() {
  return {
    tipo: "permisos",
    descripcion: "No se puede habilitar TCP en SQL Server durante la clase",
    severidad: "alta",
    estado: "abierta",
    impacto_clase: "total",
    fecha_reporte: ahora,
    sala_id: 1,
    curso: { curso_id: 1, codigo: "ISLPE04", nombre: "BASE DE DATOS AVANZADA (LINEA PROF. I)" },
    reportado_por: { nombre: "Pedro Alvarez", rol: "docente" },
    detalle: {
      software: { software_id: 1, nombre: "SQL Server 2022" },
      accion_bloqueada: "habilitar conexiones TCP",
      nivel_actual: "restringido",
      nivel_requerido: "administrador",
      solicitud_permiso_id: 1
    },
    historial: [{ estado: "abierta", fecha: ahora, por: "Pedro Alvarez" }]
  };
}

// Los casos: [titulo, debeSerAceptado, generadorDelDocumento] 
const casos = [
  ["Hardware valido",                                   true,  () => incidenciaHardware()],
  ["Software valido (con atencion e historial de 2)",   true,  () => incidenciaSoftware()],
  ["Permisos valido (sin equipo_id: afecta la sala)",   true,  () => incidenciaPermisos()],
  ["Detalle con campos extra (estructura libre)",       true,  () => { const d = incidenciaHardware(); d.detalle.temperatura_c = 78; d.detalle.fotos = ["pantalla.jpg"]; return d; }],

  ["RECHAZO: sin sala_id",                              false, () => { const d = incidenciaHardware(); delete d.sala_id; return d; }],
  ["RECHAZO: sin curso (clase afectada)",               false, () => { const d = incidenciaHardware(); delete d.curso; return d; }],
  ["RECHAZO: tipo inexistente ('red')",                 false, () => { const d = incidenciaHardware(); d.tipo = "red"; return d; }],
  ["RECHAZO: severidad fuera del dominio",              false, () => { const d = incidenciaHardware(); d.severidad = "urgente"; return d; }],
  ["RECHAZO: rol de reportante invalido",               false, () => { const d = incidenciaHardware(); d.reportado_por.rol = "visitante"; return d; }],
  ["RECHAZO: fecha_reporte como texto, no como fecha",  false, () => { const d = incidenciaHardware(); d.fecha_reporte = "2026-10-05"; return d; }],
  ["RECHAZO: historial vacio (sin trazabilidad)",       false, () => { const d = incidenciaHardware(); d.historial = []; return d; }],
  ["RECHAZO: hardware sin 'componente' en el detalle",  false, () => { const d = incidenciaHardware(); delete d.detalle.componente; return d; }],
  ["RECHAZO: tipo software con detalle de hardware",    false, () => { const d = incidenciaHardware(); d.tipo = "software"; return d; }],
  ["RECHAZO: permisos con nivel_requerido invalido",    false, () => { const d = incidenciaPermisos(); d.detalle.nivel_requerido = "root"; return d; }]
];

// Ejecución 
let correctos = 0;
casos.forEach(function (caso) {
  const titulo = caso[0], esperado = caso[1], generar = caso[2];
  let aceptado;
  try {
    coleccion.insertOne(generar());
    aceptado = true;
  } catch (e) {
    aceptado = false;
  }
  const comoSeEsperaba = (aceptado === esperado);
  if (comoSeEsperaba) correctos++;
  print((comoSeEsperaba ? "OK    " : "FALLO ") + "| " + titulo + "  ->  " + (aceptado ? "aceptado" : "rechazado"));
});

print("");
print(correctos + " de " + casos.length + " casos se comportaron como se esperaba.");

coleccion.drop();
print("Coleccion temporal eliminada.");
