# Interfaz web de SalaTrack

Aplicacion web que consulta las dos bases del proyecto desde un mismo servidor.

- **SQL Server** -> salas y equipos (Unidad 1)
- **MongoDB** -> incidencias, con CRUD completo (Unidad 2)

El navegador no se conecta a ninguna base de datos: le pide las paginas
a este servidor, y el servidor consulta la base que corresponda.

## Antes de arrancar

El contenedor de MongoDB debe estar arriba y la base `salatrack` debe
tener las colecciones creadas. Si no, correr primero:

    docker exec -i mongo-demo mongosh --quiet < ../mongodb/esquema/01_colecciones_validacion.js
    docker exec -i mongo-demo mongosh --quiet < ../mongodb/esquema/02_indices.js
    docker exec -i mongo-demo mongosh --quiet < ../mongodb/salas_prueba.js
    docker exec -i mongo-demo mongosh --quiet < ../mongodb/datos_prueba_minimos.js

## Arrancar

    npm install
    SQL_PASSWORD="<clave de sa>" npm start

Y abrir http://localhost:3000

Si no se define `SQL_PASSWORD`, la aplicacion arranca igual: solo la
pagina de Salas queda sin datos. Incidencias y Reportes funcionan,
porque esas van contra MongoDB.

## Paginas

| Pagina | Base | Que hace |
|---|---|---|
| `/incidencias` | MongoDB | Lista con filtro por sala, crear, editar y eliminar |
| `/salas` | SQL Server | Salas con su ubicacion, capacidad y numero de equipos |
| `/reportes` | MongoDB | Las tres agregaciones de `mongodb/consultas.js` |

## Variables de entorno

| Variable | Valor por defecto |
|---|---|
| `MONGO_URI` | `mongodb://localhost:27017` |
| `MONGO_DB` | `salatrack` |
| `SQL_SERVER` | `localhost` |
| `SQL_PORT` | `1433` |
| `SQL_DATABASE` | `SalaTrack` |
| `SQL_USER` | `sa` |
| `SQL_PASSWORD` | (vacia) |
