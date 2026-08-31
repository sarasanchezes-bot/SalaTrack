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

### Procedimiento sp_registrar_solicitud_permiso (RF-10)
- **Para qué:** Validar la estructura del procedimiento almacenado que registra una nueva solicitud de permiso, con manejo transaccional.
- **Prompt usado:** Revisar la estructura básica del procedimiento almacenado "sp_registrar_solicitud_permiso" con el objetivo de mejorar su eficiencia o encontrar problemáticas.
- **Decisión tomada:** se aceptó la estructura propuesta (validación del curso antes de insertar, BEGIN TRY/CATCH con ROLLBACK en caso de error), se recomendó un pequeño cambio adicional.


<!-- Agregar nuevos registros a medida que se avanza -->