// 
// SalaTrack (Unidad 2)
// Índices
// 
// Cada índice responde a una consulta concreta del proyecto
// (la justificación completa está en mongodb/modelado.md).
// Se puede re-ejecutar
//
// Uso:
//   mongosh "mongodb://localhost:27017" --file mongodb/esquema/02_indices.js
// 

db = db.getSiblingDB("salatrack");

// Salas
// Llave de negocio compartida con SQL Server. Es Única, ya que evita duplicar una sala al migrar
// y es el campo por el que las incidencias hacen $lookup hacia salas.
db.salas.createIndex({ sala_id: 1 }, { unique: true, name: "ux_salas_sala_id" });

// Encontrar a qué sala pertenece un equipo (índice multikey sobre un arreglo embebido).
db.salas.createIndex({ "equipos.equipo_id": 1 }, { name: "ix_salas_equipo_id" });

// incidencias 
// Incidencias de una sala, las más recientes van primero.
db.incidencias.createIndex({ sala_id: 1, fecha_reporte: -1 }, { name: "ix_inc_sala_fecha" });

// Incidencias repetidas en un mismo equipo en un periodo corto.
db.incidencias.createIndex({ equipo_id: 1, fecha_reporte: -1 }, { name: "ix_inc_equipo_fecha" });

// Materias más afectadas.
db.incidencias.createIndex({ "curso.curso_id": 1, fecha_reporte: -1 }, { name: "ix_inc_curso_fecha" });

// Incidencias abiertas ordenadas por su plazo.
db.incidencias.createIndex({ estado: 1, "atencion.fecha_limite": 1 }, { name: "ix_inc_estado_limite" });

// Resumen pequeño
["salas", "incidencias"].forEach(function (coleccion) {
  print("Indices de " + coleccion + ":");
  db.getCollection(coleccion).getIndexes().forEach(function (ix) {
    print("  - " + ix.name + "  " + JSON.stringify(ix.key) + (ix.unique ? "  (unico)" : ""));
  });
});
