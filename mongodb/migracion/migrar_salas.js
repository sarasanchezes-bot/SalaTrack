#!/usr/bin/env node
"use strict";

/**
 * SalaTrack (Aporte unidad 2)
 * Migración de la colección salas desde SQL Server hacia MongoDB.
 *
 * En este documento se leen 3 tablas relacionales (Sala, Equipo, EquipoSoftware + Software) y arma un pequeño documento
 * por sala, con sus equipos embebidos y, dentro de cada equipo, el software instalado.
 *
 *   SQL Server                          MongoDB (colección salas)
 *   ---------------------------------   ------------------------------------------
 *   Sala                            =  documento raíz
 *   Equipo (FK sala_id)             =  arreglo embebido 'equipos'
 *   EquipoSoftware + Software       =  arreglo embebido 'software_instalado' (la tabla puente desaparece: nivel_permisos, atributo de la relación, queda dentro de cada elemento)
 *
 * Se puede ejecutar varias veces (hace upsert por 'sala_id', no duplica nada).
 * La justificación del modelo está en mongodb/modelado.md
 *
 * Como usar: (desde la carpeta mongodb/migracion):
 *   npm install
 *   npm run migrar:prueba     solo muestra los documentos, no escribe en MongoDB
 *   npm run migrar            migra de verdad
 *
 * Variables de entorno (todas son opcionales):
 *   SQL_SERVER      servidor SQL Server, localhost  o  localhost\SQLEXPRESS   (definido: localhost)
 *   SQL_DATABASE    base de datos                                                    (definido: SalaTrack)
 *   SQL_USER        si se define, usa autenticación de SQL Server; si no, autenticación de Windows
 *   SQL_PASSWORD    clave del usuario anterior
 *   SQL_PORT        puerto TCP (solo con SQL_USER y sin instancia con nombre)
 *   SQL_ODBC_DRIVER driver ODBC para autenticación de Windows                        (definido: ODBC Driver 17 for SQL Server)
 *   MONGO_URI       cadena de conexión de MongoDB                                    (definido: mongodb://localhost:27017)
 *   MONGO_DB        base de datos de MongoDB                                         (definido: salatrack)
 */

const CONFIG = {
  sql: {
    servidor: process.env.SQL_SERVER || "localhost",
    base: process.env.SQL_DATABASE || "SalaTrack",
    usuario: process.env.SQL_USER,
    clave: process.env.SQL_PASSWORD,
    puerto: process.env.SQL_PORT ? Number(process.env.SQL_PORT) : undefined,
    driverOdbc: process.env.SQL_ODBC_DRIVER || "ODBC Driver 17 for SQL Server"
  },
  mongo: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017",
    base: process.env.MONGO_DB || "salatrack"
  }
};

// Consultas (Tes consultas simples, el armado del documento se hizo en construirSalas)
const SQL_SALAS = `
  SELECT sala_id, nombre, ubicacion, capacidad, estado
  FROM Sala
  ORDER BY sala_id`;

const SQL_EQUIPOS = `
  SELECT equipo_id, sala_id, especificaciones, estado
  FROM Equipo
  ORDER BY equipo_id`;

const SQL_SOFTWARE_INSTALADO = `
  SELECT es.equipo_id, s.software_id, s.nombre, s.version, es.nivel_permisos
  FROM EquipoSoftware es
  INNER JOIN Software s ON s.software_id = es.software_id
  ORDER BY es.equipo_id, s.software_id`;

//Transformación (función para probar sin la BD) 

/** En un documento un campo ausente reemplaza a un NULL, se descartan los valores null/undefined. */
function limpiar(objeto) {
  return Object.fromEntries(
    Object.entries(objeto).filter(([, valor]) => valor !== null && valor !== undefined)
  );
}

/**
 * Convierte las filas relacionales en documentos 'Salas'
 * @param {Array} filasSala      filas de Sala
 * @param {Array} filasEquipo    filas de Equipo
 * @param {Array} filasSoftware  filas de EquipoSoftware unidas con Software
 * @param {Date}  ahora          marca de tiempo de la migración
 */
function construirSalas(filasSala, filasEquipo, filasSoftware, ahora = new Date()) {
  const softwarePorEquipo = new Map();
  for (const fila of filasSoftware) {
    const lista = softwarePorEquipo.get(fila.equipo_id) || [];
    lista.push(limpiar({
      software_id: fila.software_id,
      nombre: fila.nombre,
      version: fila.version,
      nivel_permisos: fila.nivel_permisos
    }));
    softwarePorEquipo.set(fila.equipo_id, lista);
  }

  const equiposPorSala = new Map();
  for (const fila of filasEquipo) {
    const lista = equiposPorSala.get(fila.sala_id) || [];
    lista.push(limpiar({
      equipo_id: fila.equipo_id,
      especificaciones: fila.especificaciones,
      estado: fila.estado,
      software_instalado: softwarePorEquipo.get(fila.equipo_id) || []
    }));
    equiposPorSala.set(fila.sala_id, lista);
  }

  return filasSala.map((fila) => ({
    sala_id: fila.sala_id,
    nombre: fila.nombre,
    ubicacion: fila.ubicacion,
    capacidad: fila.capacidad,
    estado: fila.estado,
    equipos: equiposPorSala.get(fila.sala_id) || [],
    origen: "sqlserver",
    migrado_en: ahora
  }));
}

// Acceso a el SQL Server
async function conectarSql() {
  const { servidor, base, usuario, clave, puerto, driverOdbc } = CONFIG.sql;

  if (usuario) {
    // Requiere TCP/IP habilitado en el servidor.
    const sql = require("mssql");
    const config = {
      server: servidor,            // "localhost\\SQLEXPRESS" 
      database: base,
      user: usuario,
      password: clave,
      encrypt: true,
      trustServerCertificate: true // servidor local
    };
    if (puerto) config.port = puerto;
    return new sql.ConnectionPool(config).connect();
  }

  // Autenticación de Windows (la misma que de SSMS), vía ODBC.
  let sql;
  try {
    sql = require("mssql/msnodesqlv8");
  } catch (error) {
    throw new Error(
      "No se pudo cargar msnodesqlv8 (necesario para la autenticacion de Windows). " +
      "Opciones: instalarlo con 'npm install msnodesqlv8', o definir SQL_USER y SQL_PASSWORD " +
      "para usar autenticacion de SQL Server. Detalle: " + String(error.message).split("\n")[0]
    );
  }
  const connectionString =
    `Driver={${driverOdbc}};Server=${servidor};Database=${base};` +
    "Trusted_Connection=Yes;TrustServerCertificate=Yes;";
  return new sql.ConnectionPool({ connectionString }).connect();
}

async function leerRelacional() {
  const pool = await conectarSql();
  try {
    const salas = (await pool.request().query(SQL_SALAS)).recordset;
    const equipos = (await pool.request().query(SQL_EQUIPOS)).recordset;
    const software = (await pool.request().query(SQL_SOFTWARE_INSTALADO)).recordset;
    return { salas, equipos, software };
  } finally {
    await pool.close();
  }
}

// Escritura en MongoDB 
async function escribirEnMongo(documentos) {
  const { MongoClient } = require("mongodb");
  const cliente = new MongoClient(CONFIG.mongo.uri);
  try {
    await cliente.connect();
    const base = cliente.db(CONFIG.mongo.base);

    const info = await base.listCollections({ name: "salas" }).toArray();
    if (info.length === 0 || !(info[0].options && info[0].options.validator)) {
      console.warn(
        "Aviso: la coleccion 'salas' no tiene validador de esquema. " +
        "Ejecuta antes mongodb/esquema/01_colecciones_validacion.js para que MongoDB valide lo que se migra."
      );
    }

    const coleccion = base.collection("salas");
    const resultado = await coleccion.bulkWrite(
      documentos.map((doc) => ({
        replaceOne: { filter: { sala_id: doc.sala_id }, replacement: doc, upsert: true }
      })),
      { ordered: true }
    );

    const total = await coleccion.countDocuments();
    console.log(
      `Migracion lista -> nuevas: ${resultado.upsertedCount}, ` +
      `reemplazadas: ${resultado.modifiedCount}. Total en salas: ${total}.`
    );
  } catch (error) {
    if (error.writeErrors && error.writeErrors.length > 0) {
      const primero = error.writeErrors[0];
      console.error("MongoDB rechazo un documento (validacion de esquema u otro error de escritura):");
      console.error(JSON.stringify(primero.err ? primero.err.errInfo || primero.err : primero, null, 2));
    }
    throw error;
  } finally {
    await cliente.close();
  }
}

//Programa principal 
async function main() {
  const soloPrueba = process.argv.includes("--dry-run");

  console.log(`Leyendo SQL Server (${CONFIG.sql.servidor}, base ${CONFIG.sql.base})...`);
  const { salas, equipos, software } = await leerRelacional();
  console.log(`Filas leidas -> Sala: ${salas.length}, Equipo: ${equipos.length}, software instalado: ${software.length}`);

  const documentos = construirSalas(salas, equipos, software);

  if (soloPrueba) {
    console.log("Modo prueba (--dry-run): no se escribe nada en MongoDB. Documentos resultantes:");
    console.log(JSON.stringify(documentos, null, 2));
    return;
  }

  await escribirEnMongo(documentos);
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Error en la migracion:", error.message);
    process.exit(1);
  });
}

module.exports = { construirSalas, limpiar, CONFIG };
