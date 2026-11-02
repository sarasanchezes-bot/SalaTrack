## Registro

### Definición del proyecto
- **Para qué:** explorar y validar el dominio del proyecto.
- **Decisión tomada:** se eligió el problema de gestión de salas de cómputo a partir de la experiencia directa en la universidad; se descartaron otras opciones propuestas por no reflejar un problema cercano.

### Tablas del núcleo académico (Curso, RequisitoCurso, AsignacionSemestral)
- **Para qué:** confirmar posibles fallos a la hora de subir las tablas creadas y su relación con otras al momento de subir el archivo.
- **Prompt usado:** "Dado el contexto brindado, ¿te parece bien que algunas de las relaciones estén establecidas de dicha manera? Asi mismo, ¿podrías brindarme un comando específico para la creación de una branch adicional?"
- **Decisión tomada:** Se revisó la estructura propuesta, dando el visto bueno para su implementación. La idea del proyecto se aprobó para el contexto específico, al considerarse de gran interés y relevancia para la universidad. Se brindaron correctamente los comandos para implementar una rama (branch) adicional.

### CTEs de reportes, función de tabla, procedimiento almacenado y diagrama ER (Unidad 1)
- **Prompt usado:** revisar el estado del repositorio, identificar qué exigencias de la carta descriptiva faltaban en el módulo relacional, y proponer CTE, función y procedimiento ligados a los requisitos del proyecto (RF-06, RF-07, RF-10, RF-11), además del diagrama ER del modelo.
- **Decisión tomada:** se probaron las CTE contra la base de datos local y se validaron los resultados antes de aceptarlas; se aprobó el diagrama ER verificando que reflejara correctamente el esquema existente.

### Manejo transaccional: tabla RequisitoPendiente y SP de asignación curso-sala (Unidad 1)
- **Para qué:** implementar el tema de transacciones exigido para la semana, aplicándolo a la asignación semestral de un curso a una sala (RF-06).
- **Prompt usado:** revisar el esquema existente y definir cómo debía comportarse la asignación cuando la sala no cumple todos los requisitos técnicos del curso, y cómo estructurar el procedimiento con manejo transaccional.
- **Decisión tomada:** se optó por registrar la asignación aun cuando falten requisitos, dejando los faltantes en una tabla nueva (RequisitoPendiente) y cambiando el estado a 'asignada con requisitos pendientes', en lugar de bloquear la operación; esta decisión se tomó porque el RF-07 exige generar la lista de software a instalar, lo cual carece de sentido si nunca se permiten asignaciones incompletas. Se definió además el criterio de verificación: un requisito se cumple solo si todos los equipos disponibles de la sala tienen el software con el nivel de permisos requerido. Se corrigió un error de agregación en el procedimiento (Msg 8124) tras probarlo contra la base local, y se validaron los tres casos de prueba (un commit y dos rollback) antes de aceptar el código.

### Procedimiento sp_registrar_solicitud_permiso (RF-10)
- **Para qué:** Validar la estructura del procedimiento almacenado que registra una nueva solicitud de permiso, con manejo transaccional.
- **Prompt usado:** Revisar la estructura básica del procedimiento almacenado "sp_registrar_solicitud_permiso" con el objetivo de mejorar su eficiencia o encontrar problemáticas.
- **Decisión tomada:** se aceptó la estructura propuesta (validación del curso antes de insertar, BEGIN TRY/CATCH con ROLLBACK en caso de error), se recomendó un pequeño cambio adicional.

### Procedimiento sp_registrar_mantenimiento (RF-09)
- **Para qué:** Corregir el script de registrar mantenimiento para evitar posibles incidencias, mejorar calidad de código.
- **Prompt usado:** Brindar recomendaciones y cambios para la reestructuración parcial de una transacción que proteja el insert del mantenimiento aunque el cierre de incidencias falle, sin perder el registro ya insertado.
- **Decisión tomada:** Se usó `SAVE TRANSACTION` para el cierre de incidencias (un punto de guardado, no un rollback total). Se recomendó además, crear la tabla `Incidencia` (para la posibilidad de una integración en la próxima unidad de desarrollo del proyecto).

## Modelado documental de incidencias, migración de salas, índices y validación (Unidad 2, MongoDB)
- **Para qué:** Reimaginar el código, brindar ayuda y proponer mejoras para la elaboración del documento de la Unidad 2, migrar la colección salas desde SQL Server y definir los índices del esquema.
- **Prompt usado:** Se entregaron algunos fragmentos de código con varios errores, con el objetivo de recibir ayuda en la elaboración del documento escrito de la Unidad 2 y en la reestructuración del proyecto en MongoDB.
- **Decisión tomada:** Se adoptó una colección incidencias con una estructura variable en el campo detalle, según el tipo de incidencia (hardware, software o permisos). Se incluyeron los datos comunes, el historial y la información de atención dentro del mismo documento, mientras que la sala se mantuvo referenciada mediante sala_id para permitir el uso de $lookup. Como alternativa, se proporcionó un documento organizado con recomendaciones sobre el hardware y el software que se utilizarían en la unidad de MongoDB. Además, se reorganizó el código y se implementaron ciertas características importantes que no estaban presentes en el código original.

### Consultas de agregación y $lookup (Unidad 2, MongoDB)
- **Para qué:** cubrir las exigencias de la carta descriptiva para la Unidad 2 (al menos una consulta con Aggregation Framework y al menos una con $lookup), ligándolas a preguntas reales del proyecto.
- **Prompt usado:** proponer consultas sobre la colección incidencias que respondan en qué salas se pierden más clases y qué software falla más, limitándose a los operadores vistos en clase, y explicar cada etapa del pipeline para poder sustentarla.
- **Decisión tomada:** se aceptaron tres consultas ($group/$sort/$limit; $group/$lookup/$unwind/$project/$sort; y $match/$group/$sort). Se corrigió que el localField del $lookup debía ser _id y no sala_id, porque el $group previo ya había reagrupado los documentos. Se ejecutaron las tres contra la base local y se verificaron los resultados antes de aceptarlas. Se añadió además un archivo de datos de prueba mínimos con ids que existen en SQL Server, al detectarse que los datos de prueba iniciales usaban identificadores inexistentes que dejaban el $lookup sin resultados.

### Interfaz web de SalaTrack (Unidad 2)
- **Para qué:** atender la recomendación del docente de agregar una capa visual que permita ver el CRUD y las consultas en funcionamiento.
- **Prompt usado:** construir una aplicación sencilla en Node/Express que consulte las dos bases desde un mismo servidor, con el CRUD de incidencias sobre MongoDB y la consulta de salas sobre SQL Server.
- **Decisión tomada:** se optó por plantillas EJS renderizadas en el servidor en lugar de una API con front separado, por ser más simple de explicar y suficiente para la demostración. Se decidió que el formulario cambie sus campos según el tipo de incidencia, para que la estructura variable del documento quede visible en la interfaz. Las credenciales se leen de variables de entorno y no se versionan. Se probó la aplicación contra ambas bases locales antes de aceptarla.
