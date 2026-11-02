// ============================================================
// SalaTrack - Unidad 2 (MongoDB)
// Consultas de agregacion y $lookup
// ============================================================
// Las tres consultas responden preguntas del proyecto:
//   1. En que salas se pierden mas clases
//   2. Lo mismo, pero mostrando el nombre de la sala
//   3. Que software es el que mas falla
//
// Usan el modelo documental definido en mongodb/modelado.md
//
// Uso:
//   mongosh "mongodb://localhost:27017" --file mongodb/consultas.js
// ============================================================

db = db.getSiblingDB("salatrack");


// ------------------------------------------------------------
// CONSULTA 1: salas con mas incidencias reportadas
// ------------------------------------------------------------
// Pregunta: en que sala se pierden mas clases por problemas tecnicos?
// Etapas: $group agrupa por sala y cuenta, $sort ordena de mayor a
// menor, $limit deja solo las tres primeras.
// ------------------------------------------------------------

print("--- 1. Salas con mas incidencias ---");

db.incidencias.aggregate([
  { $group: { _id: "$sala_id", total: { $sum: 1 } } },
  { $sort:  { total: -1 } },
  { $limit: 3 }
]).forEach(printjson);


// ------------------------------------------------------------
// CONSULTA 2: el mismo ranking, pero con el nombre de la sala
// ------------------------------------------------------------
// La consulta 1 devuelve el numero de la sala, no su nombre, porque
// el nombre vive en la coleccion 'salas'. $lookup trae ese dato.
//
// localField  = el campo del resultado del $group (quedo en _id)
// foreignField= el campo con el que se compara en 'salas'
// as          = nombre del campo nuevo, SIEMPRE un arreglo
//
// $unwind saca el unico elemento de ese arreglo para poder leer
// sala.nombre directamente.
// ------------------------------------------------------------

print("--- 2. Salas con mas incidencias (con nombre) ---");

db.incidencias.aggregate([
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
]).forEach(printjson);


// ------------------------------------------------------------
// CONSULTA 3: software que mas falla
// ------------------------------------------------------------
// Pregunta: que programa da mas problemas? Sirve para decidir que
// revisar o reinstalar al inicio del semestre.
//
// $match filtra primero (solo incidencias de tipo software) y luego
// $group cuenta por nombre del programa. Filtrar antes de agrupar
// hace que el $group trabaje sobre menos documentos.
// ------------------------------------------------------------

print("--- 3. Software con mas incidencias ---");

db.incidencias.aggregate([
  { $match: { tipo: "software" } },
  { $group: { _id: "$detalle.software.nombre", total: { $sum: 1 } } },
  { $sort:  { total: -1 } }
]).forEach(printjson);
