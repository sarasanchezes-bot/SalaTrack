// ============================================================
// SalaTrack - Interfaz web (Unidad 2)
// ============================================================
// Un solo servidor que habla con las dos bases:
//   - SQL Server  -> salas y equipos (modulo relacional, Unidad 1)
//   - MongoDB     -> incidencias     (modulo documental, Unidad 2)
//
// El navegador no se conecta a ninguna base: le pide las paginas
// a este servidor, y este servidor consulta la base que toque.
//
// Uso:
//   npm install
//   npm start
//   abrir http://localhost:3000
// ============================================================

const express = require("express");
const { MongoClient } = require("mongodb");
const sql = require("mssql");

const app = express();
const PUERTO = 3000;

// ------------------------------------------------------------
// Configuracion de las dos conexiones
// ------------------------------------------------------------
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const MONGO_DB = process.env.MONGO_DB || "salatrack";

const CONFIG_SQL = {
  server: process.env.SQL_SERVER || "localhost",
  port: Number(process.env.SQL_PORT || 1433),
  database: process.env.SQL_DATABASE || "SalaTrack",
  user: process.env.SQL_USER || "sa",
  password: process.env.SQL_PASSWORD || "",
  options: { encrypt: true, trustServerCertificate: true }
};

let baseMongo;   // base de datos salatrack
let incidencias; // coleccion de incidencias
let salasMongo;  // coleccion de salas (migrada desde SQL Server)
let poolSql;     // conexion a SQL Server

// ------------------------------------------------------------
// Catalogos
// ------------------------------------------------------------
// Vienen de las tablas Software y Curso de SQL Server. Se dejan
// aqui porque son fijos y el formulario los necesita para armar
// el documento con los ids correctos.
const CATALOGO_SOFTWARE = [
  { software_id: 1, nombre: "SQL Server 2022", version: "16.0" },
  { software_id: 2, nombre: "Visual Studio", version: "2022" },
  { software_id: 3, nombre: "Python", version: "3.12" },
  { software_id: 4, nombre: "MongoDB Compass", version: "1.42" },
  { software_id: 5, nombre: "Docker Desktop", version: "4.30" }
];

const CATALOGO_CURSOS = [
  { curso_id: 1, codigo: "ISLPE04", nombre: "BASE DE DATOS AVANZADA (LINEA PROF. I)" },
  { curso_id: 2, codigo: "ISLPE05", nombre: "INTELIGENCIA ARTIFICIAL (LINEA PROF. II)" },
  { curso_id: 3, codigo: "ISSAE05", nombre: "SEGURIDAD INFORMATICA (SEM. ACTUALIZACION II)" },
  { curso_id: 4, codigo: "IS066", nombre: "ARQUITECTURA DE SISTEMAS" }
];

const TIPOS = ["hardware", "software", "permisos"];
const SEVERIDADES = ["baja", "media", "alta", "critica"];
const ESTADOS = ["abierta", "en_atencion", "cerrada"];
const NIVELES = ["restringido", "estandar", "administrador"];

// ------------------------------------------------------------
// Configuracion de Express
// ------------------------------------------------------------
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true })); // lee los formularios

// Datos que todas las vistas necesitan para el menu
app.use(function (peticion, respuesta, siguiente) {
  respuesta.locals.ruta = peticion.path;
  siguiente();
});


// ------------------------------------------------------------
// INICIO
// ------------------------------------------------------------
app.get("/", function (peticion, respuesta) {
  respuesta.redirect("/incidencias");
});


// ------------------------------------------------------------
// INCIDENCIAS (MongoDB) - listar
// ------------------------------------------------------------
app.get("/incidencias", async function (peticion, respuesta) {
  // Filtro opcional por sala, llega como ?sala_id=1
  const filtro = {};
  if (peticion.query.sala_id) {
    filtro.sala_id = Number(peticion.query.sala_id);
  }

  const lista = await incidencias
    .find(filtro)
    .sort({ fecha_reporte: -1 })
    .toArray();

  const salas = await salasDeMongo();

  respuesta.render("incidencias", { lista, salas, filtroSala: peticion.query.sala_id || "" });
});


// ------------------------------------------------------------
// INCIDENCIAS - formulario de creacion
// ------------------------------------------------------------
app.get("/incidencias/nueva", async function (peticion, respuesta) {
  const salas = await salasDeMongo();
  respuesta.render("formulario", {
    incidencia: null,
    salas,
    catalogoSoftware: CATALOGO_SOFTWARE,
    catalogoCursos: CATALOGO_CURSOS,
    tipos: TIPOS,
    severidades: SEVERIDADES,
    estados: ESTADOS,
    niveles: NIVELES
  });
});


// ------------------------------------------------------------
// INCIDENCIAS - crear (insertOne)
// ------------------------------------------------------------
app.post("/incidencias", async function (peticion, respuesta) {
  const documento = armarIncidencia(peticion.body);

  try {
    await incidencias.insertOne(documento);
    respuesta.redirect("/incidencias");
  } catch (error) {
    respuesta.status(400).render("error", {
      titulo: "MongoDB rechazo el documento",
      mensaje: explicarError(error)
    });
  }
});


// ------------------------------------------------------------
// INCIDENCIAS - formulario de edicion
// ------------------------------------------------------------
app.get("/incidencias/:id/editar", async function (peticion, respuesta) {
  const { ObjectId } = require("mongodb");
  const incidencia = await incidencias.findOne({ _id: new ObjectId(peticion.params.id) });
  const salas = await salasDeMongo();

  respuesta.render("formulario", {
    incidencia,
    salas,
    catalogoSoftware: CATALOGO_SOFTWARE,
    catalogoCursos: CATALOGO_CURSOS,
    tipos: TIPOS,
    severidades: SEVERIDADES,
    estados: ESTADOS,
    niveles: NIVELES
  });
});


// ------------------------------------------------------------
// INCIDENCIAS - actualizar (updateOne)
// ------------------------------------------------------------
// Si cambia el estado, se agrega un elemento al historial con
// $push. Asi se cumple la trazabilidad del modelo (RNF-03).
// ------------------------------------------------------------
app.post("/incidencias/:id", async function (peticion, respuesta) {
  const { ObjectId } = require("mongodb");
  const id = new ObjectId(peticion.params.id);

  const actual = await incidencias.findOne({ _id: id });
  const nuevoEstado = peticion.body.estado;

  const cambios = {
    $set: {
      descripcion: peticion.body.descripcion,
      severidad: peticion.body.severidad,
      estado: nuevoEstado
    }
  };

  if (actual.estado !== nuevoEstado) {
    cambios.$push = {
      historial: {
        estado: nuevoEstado,
        fecha: new Date(),
        por: peticion.body.nombre_reporta || "Sistema",
        nota: "Cambio de estado desde la interfaz web"
      }
    };
  }

  try {
    await incidencias.updateOne({ _id: id }, cambios);
    respuesta.redirect("/incidencias");
  } catch (error) {
    respuesta.status(400).render("error", {
      titulo: "MongoDB rechazo la actualizacion",
      mensaje: explicarError(error)
    });
  }
});


// ------------------------------------------------------------
// INCIDENCIAS - eliminar (deleteOne)
// ------------------------------------------------------------
app.post("/incidencias/:id/eliminar", async function (peticion, respuesta) {
  const { ObjectId } = require("mongodb");
  await incidencias.deleteOne({ _id: new ObjectId(peticion.params.id) });
  respuesta.redirect("/incidencias");
});


// ------------------------------------------------------------
// SALAS (SQL Server) - solo lectura
// ------------------------------------------------------------
// Esta pagina no toca MongoDB: consulta directamente las tablas
// relacionales de la Unidad 1.
// ------------------------------------------------------------
app.get("/salas", async function (peticion, respuesta) {
  try {
    const resultado = await poolSql.request().query(`
      SELECT s.sala_id, s.nombre, s.ubicacion, s.capacidad, s.estado,
             COUNT(e.equipo_id) AS equipos
      FROM Sala s
      LEFT JOIN Equipo e ON e.sala_id = s.sala_id
      GROUP BY s.sala_id, s.nombre, s.ubicacion, s.capacidad, s.estado
      ORDER BY s.sala_id
    `);
    respuesta.render("salas", { salas: resultado.recordset, error: null });
  } catch (error) {
    respuesta.render("salas", { salas: [], error: error.message });
  }
});


// ------------------------------------------------------------
// REPORTES (MongoDB) - las tres consultas de agregacion
// ------------------------------------------------------------
// Son exactamente los mismos pipelines de mongodb/consultas.js.
// ------------------------------------------------------------
app.get("/reportes", async function (peticion, respuesta) {
  // 1. Salas con mas incidencias
  const porSala = await incidencias.aggregate([
    { $group: { _id: "$sala_id", total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 3 }
  ]).toArray();

  // 2. Lo mismo, pero con el nombre de la sala ($lookup)
  const porSalaConNombre = await incidencias.aggregate([
    { $group: { _id: "$sala_id", total: { $sum: 1 } } },
    { $lookup: {
        from: "salas",
        localField: "_id",
        foreignField: "sala_id",
        as: "sala"
    }},
    { $unwind: "$sala" },
    { $project: {
        _id: 0,
        sala_id: "$_id",
        nombre: "$sala.nombre",
        ubicacion: "$sala.ubicacion",
        total: 1
    }},
    { $sort: { total: -1 } }
  ]).toArray();

  // 3. Software con mas incidencias
  const porSoftware = await incidencias.aggregate([
    { $match: { tipo: "software" } },
    { $group: { _id: "$detalle.software.nombre", total: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ]).toArray();

  respuesta.render("reportes", { porSala, porSalaConNombre, porSoftware });
});


// ------------------------------------------------------------
// Funciones de apoyo
// ------------------------------------------------------------

// Lista de salas desde MongoDB, para los menus desplegables.
async function salasDeMongo() {
  return salasMongo
    .find({}, { projection: { sala_id: 1, nombre: 1, equipos: 1 } })
    .sort({ sala_id: 1 })
    .toArray();
}

// Arma el documento de incidencia con la forma que exige el
// validador de mongodb/esquema/01_colecciones_validacion.js.
// El campo 'detalle' cambia segun el tipo: esa es la razon de
// que esta entidad viva en MongoDB y no en una tabla.
function armarIncidencia(datos) {
  const ahora = new Date();
  const curso = CATALOGO_CURSOS.find(c => c.curso_id === Number(datos.curso_id));

  const documento = {
    tipo: datos.tipo,
    descripcion: datos.descripcion,
    severidad: datos.severidad,
    estado: datos.estado,
    fecha_reporte: ahora,
    sala_id: Number(datos.sala_id),
    curso: { curso_id: curso.curso_id, codigo: curso.codigo, nombre: curso.nombre },
    reportado_por: { nombre: datos.nombre_reporta, rol: datos.rol_reporta },
    historial: [
      { estado: datos.estado, fecha: ahora, por: datos.nombre_reporta }
    ]
  };

  if (datos.impacto_clase) {
    documento.impacto_clase = datos.impacto_clase;
  }
  if (datos.equipo_id) {
    documento.equipo_id = Number(datos.equipo_id);
  }

  // El detalle depende del tipo
  if (datos.tipo === "hardware") {
    documento.detalle = {
      componente: datos.componente,
      sintoma: datos.sintoma,
      enciende: datos.enciende === "si"
    };
  } else if (datos.tipo === "software") {
    documento.detalle = {
      software: buscarSoftware(datos.software_id),
      mensaje_error: datos.mensaje_error,
      reproducible: datos.reproducible === "si"
    };
  } else if (datos.tipo === "permisos") {
    documento.detalle = {
      accion_bloqueada: datos.accion_bloqueada,
      nivel_actual: datos.nivel_actual,
      nivel_requerido: datos.nivel_requerido
    };
    if (datos.software_id) {
      documento.detalle.software = buscarSoftware(datos.software_id);
    }
  }

  return documento;
}

function buscarSoftware(id) {
  const encontrado = CATALOGO_SOFTWARE.find(s => s.software_id === Number(id));
  return {
    software_id: encontrado.software_id,
    nombre: encontrado.nombre,
    version: encontrado.version
  };
}

// Traduce el error del validador a algo legible en pantalla.
function explicarError(error) {
  if (error.errInfo && error.errInfo.details) {
    return JSON.stringify(error.errInfo.details, null, 2);
  }
  return error.message;
}


// ------------------------------------------------------------
// Arranque: primero las conexiones, despues el servidor
// ------------------------------------------------------------
async function iniciar() {
  const clienteMongo = new MongoClient(MONGO_URI);
  await clienteMongo.connect();
  baseMongo = clienteMongo.db(MONGO_DB);
  incidencias = baseMongo.collection("incidencias");
  salasMongo = baseMongo.collection("salas");
  console.log("Conectado a MongoDB:", MONGO_URI);

  try {
    poolSql = await new sql.ConnectionPool(CONFIG_SQL).connect();
    console.log("Conectado a SQL Server:", CONFIG_SQL.server);
  } catch (error) {
    // El front sigue sirviendo: solo la pagina de salas queda sin datos.
    console.warn("Aviso: no se pudo conectar a SQL Server ->", error.message);
    console.warn("Las incidencias y los reportes funcionan igual.");
  }

  app.listen(PUERTO, function () {
    console.log("SalaTrack corriendo en http://localhost:" + PUERTO);
  });
}

iniciar();
