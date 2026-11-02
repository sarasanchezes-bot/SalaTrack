// ============================================================
// SalaTrack - Unidad 2 (MongoDB)
// Salas de prueba (atajo para desarrollo)
// ============================================================
// Estos documentos son identicos a los que genera
// mongodb/migracion/migrar_salas.js a partir de los seeds de
// SQL Server (sql-server/seeds/01_seeds_nucleo_fisico.sql).
//
// Sirven para probar las consultas sin tener que levantar la
// conexion a SQL Server. Para la entrega la coleccion se llena
// con la migracion, que es la fuente de verdad.
//
// Usa replaceOne con upsert por sala_id: se puede re-ejecutar y
// la migracion real lo sobrescribe sin duplicar nada.
//
// Uso:
//   mongosh "mongodb://localhost:27017" --file mongodb/salas_prueba.js
// ============================================================

db = db.getSiblingDB("salatrack");

const ahora = new Date();

const salas = [
  {
    sala_id: 1,
    nombre: "Sala 301",
    ubicacion: "Bloque 1 - Piso 3",
    capacidad: 30,
    estado: "disponible",
    equipos: [
      {
        equipo_id: 1,
        especificaciones: "Core i5, 8GB RAM, 256GB SSD",
        estado: "disponible",
        software_instalado: [
          { software_id: 1, nombre: "SQL Server 2022", version: "16.0", nivel_permisos: "restringido" },
          { software_id: 2, nombre: "Visual Studio",   version: "2022", nivel_permisos: "estandar" },
          { software_id: 5, nombre: "Docker Desktop",  version: "4.30", nivel_permisos: "administrador" }
        ]
      },
      {
        equipo_id: 2,
        especificaciones: "Core i5, 8GB RAM, 256GB SSD",
        estado: "disponible",
        software_instalado: [
          { software_id: 1, nombre: "SQL Server 2022", version: "16.0", nivel_permisos: "restringido" },
          { software_id: 2, nombre: "Visual Studio",   version: "2022", nivel_permisos: "estandar" }
        ]
      }
    ],
    origen: "sqlserver",
    migrado_en: ahora
  },
  {
    sala_id: 2,
    nombre: "Sala 302",
    ubicacion: "Bloque 1 - Piso 3",
    capacidad: 25,
    estado: "disponible",
    equipos: [
      {
        equipo_id: 3,
        especificaciones: "Core i3, 4GB RAM, 500GB HDD",
        estado: "disponible",
        software_instalado: [
          { software_id: 2, nombre: "Visual Studio", version: "2022", nivel_permisos: "estandar" },
          { software_id: 3, nombre: "Python",        version: "3.12", nivel_permisos: "estandar" }
        ]
      },
      {
        equipo_id: 4,
        especificaciones: "Core i3, 4GB RAM, 500GB HDD",
        estado: "en mantenimiento",
        software_instalado: [
          { software_id: 3, nombre: "Python", version: "3.12", nivel_permisos: "estandar" }
        ]
      }
    ],
    origen: "sqlserver",
    migrado_en: ahora
  },
  {
    sala_id: 3,
    nombre: "Laboratorio 401",
    ubicacion: "Bloque 2 - Piso 4",
    capacidad: 20,
    estado: "disponible",
    equipos: [
      {
        equipo_id: 5,
        especificaciones: "Core i7, 16GB RAM, 512GB SSD",
        estado: "disponible",
        software_instalado: [
          { software_id: 3, nombre: "Python",          version: "3.12", nivel_permisos: "estandar" },
          { software_id: 4, nombre: "MongoDB Compass", version: "1.42", nivel_permisos: "estandar" },
          { software_id: 5, nombre: "Docker Desktop",  version: "4.30", nivel_permisos: "administrador" }
        ]
      },
      {
        equipo_id: 6,
        especificaciones: "Core i7, 16GB RAM, 512GB SSD",
        estado: "disponible",
        software_instalado: [
          { software_id: 3, nombre: "Python",          version: "3.12", nivel_permisos: "estandar" },
          { software_id: 4, nombre: "MongoDB Compass", version: "1.42", nivel_permisos: "estandar" }
        ]
      }
    ],
    origen: "sqlserver",
    migrado_en: ahora
  }
];

db.salas.bulkWrite(
  salas.map(doc => ({
    replaceOne: { filter: { sala_id: doc.sala_id }, replacement: doc, upsert: true }
  }))
);

print("Salas en la coleccion: " + db.salas.countDocuments());
