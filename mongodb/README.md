# Unidad 2 

Módulo de registro de eventos e incidencias.

## Contenido
| `modelado.md` : estructura de la incidencia, qué se embebe y qué se referencia, validación e índices.
| `esquema/01_colecciones_validacion.js`: Crea las colecciones `salas` e `incidencias` con la validación del esquema (`$jsonSchema`). 
| `esquema/02_indices.js` : Crea los índices. 
| `esquema/03_pruebas_validacion.js`: casos que se aceptan y casos que se rechazan (usa una colección temporal).
| `migracion/migrar_salas.js`: Migra la colección `salas` desde SQL Server (sala + equipos + software instalado).

## Orden de ejecución

Los requisitos: MongoDB en `localhost:27017`, `mongosh` y Node.js 18.19 o superior (para la migración).

```bash
# 1. Colecciones con validación e índices
mongosh "mongodb://localhost:27017" --file mongodb/esquema/01_colecciones_validacion.js
mongosh "mongodb://localhost:27017" --file mongodb/esquema/02_indices.js

# 2. Migrar salas desde SQL Server (la base ya debe estar desplegada)
cd mongodb/migracion
npm install
npm run migrar:prueba     # solo muestra los documentos, no escribe en MongoDB
npm run migrar            # No duplica
cd ../..

# 3. Ver la validación en acción (Opcional)
mongosh "mongodb://localhost:27017" --file mongodb/esquema/03_pruebas_validacion.js
```

La base de datos de MongoDB se llama `salatrack`.

## Conexión de la migración

Por defecto usa **La autenticación de Windows** contra `localhost`. Todo estos son variables del entorno:

| `SQL_SERVER` | Servidor SQL Server, p. ej. `localhost\SQLEXPRESS` | `localhost` |
| `SQL_DATABASE` | Base de datos | `SalaTrack` |
| `SQL_USER` / `SQL_PASSWORD` | Si se definen, usa autenticación de SQL Server en vez de la de Windows | — |
| `SQL_ODBC_DRIVER` | Driver ODBC (autenticación de Windows) | `ODBC Driver 17 for SQL Server` |
| `MONGO_URI` | Cadena de conexión de MongoDB | `mongodb://localhost:27017` |
| `MONGO_DB` | Base de datos de MongoDB | `salatrack` |

Ejemplo en Git Bash con una instancia con nombre:

```bash
SQL_SERVER='localhost\SQLEXPRESS' npm run migrar:prueba
```

## Solución de problemas

- No se pudo cargar msnodesqlv8: ejecuta `npm install msnodesqlv8`, o usa autenticación de SQL Server definiendo `SQL_USER` y `SQL_PASSWORD`.
- Error de driver o "data source name not found: define `SQL_ODBC_DRIVER` con el nombre exacto del driver instalado (por ejemplo `ODBC Driver 18 for SQL Server`).
- tiempo de espera agotado: SQL Server Express trae TCP/IP deshabilitado. Actívalo en SQL Server Configuration Manager (*SQL Server Network Configuration = Protocols = TCP/IP = Enable*) y reinicia el servicio. Si usas una instancia con nombre, el servicio *SQL Server Browser* debe estar en ejecución.
- MongoDB rechazó un documento: el documento no cumple el validador de `salas`; el mensaje indica qué regla falló. Ver `modelado.md`, sección 8.
