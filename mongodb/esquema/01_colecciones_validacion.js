// 
// SalaTrack (Unidad 2)
// Colecciones y validación de esquema ($jsonSchema)
// 
// Crea (o actualiza) las colecciones 'salas' e 'incidencias', cada una
// con su validador. Se puede re-ejecutar.
//
// Uso:
//   mongosh "mongodb://localhost:27017" --file mongodb/esquema/01_colecciones_validacion.js
//
// La justificación de cada decisión está en mongodb/modelado.md

db = db.getSiblingDB("salatrack");

// Valores permitidos
const TIPOS_INCIDENCIA   = ["hardware", "software", "permisos"];
const SEVERIDADES        = ["baja", "media", "alta", "critica"];
const ESTADOS_INCIDENCIA = ["abierta", "en_atencion", "cerrada"];
const NIVELES_PERMISO    = ["restringido", "estandar", "administrador"];

// Fragmento reutilizable
const referenciaSoftware = {
  bsonType: "object",
  required: ["software_id", "nombre"],
  properties: {
    software_id: { bsonType: "number", minimum: 1 },
    nombre:      { bsonType: "string", minLength: 1, maxLength: 100 },
    version:     { bsonType: "string", maxLength: 50 }
  }
};


// Colección 'salas' (migrada desde SQL Server: Sala + Equipo + EquipoSoftware + Software)
const validadorSalas = {
  $jsonSchema: {
    bsonType: "object",
    title: "Sala de computo con sus equipos y el software instalado en cada uno",
    required: ["sala_id", "nombre", "ubicacion", "capacidad", "estado", "equipos"],
    properties: {
      sala_id:   { bsonType: "number", minimum: 1, description: "PK de Sala en SQL Server (llave de negocio compartida)" },
      nombre:    { bsonType: "string", minLength: 1, maxLength: 50 },
      ubicacion: { bsonType: "string", minLength: 1, maxLength: 100 },
      capacidad: { bsonType: "number", minimum: 1 },
      estado:    { enum: ["disponible", "fuera de servicio"] },
      equipos: {
        bsonType: "array",
        description: "Equipos de la sala (embebidos: viven y se consultan siempre dentro de su sala)",
        items: {
          bsonType: "object",
          required: ["equipo_id", "estado"],
          properties: {
            equipo_id:        { bsonType: "number", minimum: 1 },
            especificaciones: { bsonType: "string", maxLength: 200 },
            estado:           { enum: ["disponible", "en mantenimiento", "fuera de servicio"] },
            software_instalado: {
              bsonType: "array",
              description: "Reemplaza a la tabla puente EquipoSoftware; nivel_permisos es el atributo de la relación",
              items: {
                bsonType: "object",
                required: ["software_id", "nombre", "nivel_permisos"],
                properties: {
                  software_id:    { bsonType: "number", minimum: 1 },
                  nombre:         { bsonType: "string", minLength: 1, maxLength: 100 },
                  version:        { bsonType: "string", maxLength: 50 },
                  nivel_permisos: { bsonType: "string", minLength: 1, maxLength: 50 }
                }
              }
            }
          }
        }
      }
    }
  }
};


// Colección 'incidencias'
const validadorIncidencias = {
  $jsonSchema: {
    bsonType: "object",
    title: "Incidencia reportada durante una sesion de clase",
    required: [
      "tipo", "descripcion", "severidad", "estado", "fecha_reporte",
      "sala_id", "curso", "reportado_por", "detalle", "historial"
    ],
    properties: {
      tipo:          { enum: TIPOS_INCIDENCIA, description: "Discriminador: define la forma de `detalle`" },
      descripcion:   { bsonType: "string", minLength: 10, maxLength: 500 },
      severidad:     { enum: SEVERIDADES },
      estado:        { enum: ESTADOS_INCIDENCIA },
      impacto_clase: { enum: ["ninguno", "parcial", "total"], description: "Cuanto afecto el desarrollo de la clase" },
      fecha_reporte: { bsonType: "date" },

      // Referencias
      sala_id:   { bsonType: "number", minimum: 1, description: "Referencia a salas.sala_id" },
      equipo_id: { bsonType: "number", minimum: 1, description: "Referencia a salas.equipos.equipo_id (opcional: hay incidencias de toda la sala)" },

      // Embebidos 
      curso: {
        bsonType: "object",
        description: "Clase afectada: copia de lo que siempre se muestra (curso_id referencia a Curso en SQL Server)",
        required: ["curso_id"],
        properties: {
          curso_id: { bsonType: "number", minimum: 1 },
          codigo:   { bsonType: "string", maxLength: 20 },
          nombre:   { bsonType: "string", maxLength: 100 }
        }
      },
      reportado_por: {
        bsonType: "object",
        required: ["nombre", "rol"],
        properties: {
          nombre: { bsonType: "string", minLength: 2, maxLength: 100 },
          rol:    { enum: ["estudiante", "docente"] }
        }
      },
      atencion: {
        bsonType: "object",
        description: "Plazo, tecnico y solucion. El plazo (fecha_limite) es la siguiente sesion del curso en la sala",
        properties: {
          fecha_limite:   { bsonType: "date" },
          tecnico_id:     { bsonType: "number", minimum: 1, description: "Referencia a Tecnico en SQL Server" },
          tecnico_nombre: { bsonType: "string", maxLength: 100 },
          fecha_cierre:   { bsonType: "date" },
          solucion:       { bsonType: "string", maxLength: 500 }
        }
      },
      historial: {
        bsonType: "array",
        minItems: 1,
        description: "Trazabilidad (RNF-03): un elemento por cada cambio de estado",
        items: {
          bsonType: "object",
          required: ["estado", "fecha"],
          properties: {
            estado: { enum: ESTADOS_INCIDENCIA },
            fecha:  { bsonType: "date" },
            nota:   { bsonType: "string", maxLength: 300 },
            por:    { bsonType: "string", maxLength: 100 }
          }
        }
      },
      detalle: { bsonType: "object", description: "Estructura variable: su forma depende de `tipo` (ver oneOf)" }
    },

    // Exactamente una de las tres ramas debe cumplirse.
    // Cada rama fija 'tipo' y exige solo los campos mínimos de su 'detalle';
    // el resto de campos del detalle queda libre
    oneOf: [
      {
        title: "Incidencia de hardware",
        properties: {
          tipo: { enum: ["hardware"] },
          detalle: {
            bsonType: "object",
            required: ["componente", "sintoma"],
            properties: {
              componente: { bsonType: "string", minLength: 2, maxLength: 60 },
              sintoma:    { bsonType: "string", minLength: 3, maxLength: 200 },
              enciende:   { bsonType: "bool" }
            }
          }
        }
      },
      {
        title: "Incidencia de software",
        properties: {
          tipo: { enum: ["software"] },
          detalle: {
            bsonType: "object",
            required: ["software", "mensaje_error"],
            properties: {
              software:      referenciaSoftware,
              mensaje_error: { bsonType: "string", minLength: 3, maxLength: 300 },
              reproducible:  { bsonType: "bool" }
            }
          }
        }
      },
      {
        title: "Incidencia de permisos",
        properties: {
          tipo: { enum: ["permisos"] },
          detalle: {
            bsonType: "object",
            required: ["accion_bloqueada", "nivel_requerido"],
            properties: {
              software:             referenciaSoftware,
              accion_bloqueada:     { bsonType: "string", minLength: 3, maxLength: 200 },
              nivel_actual:         { enum: NIVELES_PERMISO },
              nivel_requerido:      { enum: NIVELES_PERMISO },
              solicitud_permiso_id: { bsonType: "number", minimum: 1, description: "Referencia a SolicitudPermiso en SQL Server" }
            }
          }
        }
      }
    ]
  }
};

// Crear o actualizar
function crearOActualizar(nombre, validador) {
  const opciones = { validator: validador, validationLevel: "strict", validationAction: "error" };
  if (db.getCollectionInfos({ name: nombre }).length === 0) {
    db.createCollection(nombre, opciones);
    print("Coleccion creada con validador: " + nombre);
  } else {
    db.runCommand(Object.assign({ collMod: nombre }, opciones));
    print("Coleccion existente, validador actualizado: " + nombre);
  }
}

crearOActualizar("salas", validadorSalas);
crearOActualizar("incidencias", validadorIncidencias);
