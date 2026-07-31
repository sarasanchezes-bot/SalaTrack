# SalaTrack — Sistema de Gestión y Análisis de Salas de Cómputo

Proyecto del curso Bases de Datos Avanzadas — Universidad Católica Luis Amigó

Docente: Juan Felipe Muñoz Fernández

Participantes y roles
Usuario GitHub	Rol
@sarasanchezes-bot	Líder de desarrollo - Diseño de BD - Analítica

# 📋 Descripción del problema

Las salas de cómputo de la Universidad Católica Luis Amigó son un recurso crítico para las clases prácticas. Cada materia tiene necesidades técnicas distintas — un curso de bases de datos requiere un motor con protocolos habilitados, uno de videojuegos otras herramientas — pero no existe un sistema que registre qué ofrece realmente cada sala frente a lo que cada materia necesita, ni que deje evidencia de los problemas que ocurren durante las clases.

Un caso concreto: el software se instala según lo solicita cada docente, pero con restricciones de permisos que impiden modificar configuraciones, habilitar protocolos o instalar herramientas durante la clase — como ocurre al no poder habilitar conexiones TCP en un motor de base de datos. No hay un canal formal para reportar estas situaciones, ni registro de cuántas clases se ven afectadas y por qué.

La consecuencia de fondo: la institución no tiene datos para decidir qué salas presentan más problemas, qué equipos fallan repetidamente, qué materias resultan más afectadas, ni si conviene invertir en equipos o ajustar configuraciones. A esto se suma que los equipos se reconfiguran al inicio de cada semestre —se limpian e instalan los programas según lo que se requiera— sin una fuente estructurada que indique qué necesita cada materia, por lo que los mismos errores de configuración tienden a repetirse período tras período. Hoy esas decisiones y esa preparación se hacen sin evidencia ni memoria histórica.

SalaTrack será un sistema backend que registrará qué ofrece cada sala, qué requiere cada curso y qué ocurre durante las sesiones, para convertir ese cruce en información útil para la toma de decisiones.

Alcance: el sistema cubrirá las salas de clases y laboratorios: asignaciones semestrales, requisitos técnicos de cada curso frente a la dotación real de las salas, registro de incidencias, mantenimientos y análisis histórico. Queda fuera la reserva puntual de salas (que ya gestiona el sistema académico de la universidad), la gestión de las salas de la biblioteca (uso libre de estudiantes) y la administración de red e infraestructura física, que corresponde al área de sistemas.

# 🎯 Solución propuesta por unidades

El sistema abordará el problema en tres grandes módulos, cada uno con la tecnología más adecuada según lo visto en el curso:

Gestión operativa (Unidad 1 — SQL Server):
Se planea modelar y gestionar salas, equipos, software instalado, requisitos técnicos por curso, asignaciones semestrales y mantenimientos. Esta parte del sistema requerirá integridad transaccional y validaciones de compatibilidad entre lo que cada curso necesita y lo que cada sala ofrece, por lo que se trabajará sobre una base de datos relacional. Se explorarán herramientas avanzadas de SQL Server como stored procedures, triggers y CTEs a medida que se avance en el curso.

Registro de eventos e incidencias (Unidad 2 — bases de datos no relacionales):
Las incidencias reportadas durante las sesiones de clase son datos de naturaleza variable: una falla de hardware no tiene los mismos campos que un problema de permisos o un error de software. Por esta razón se planea explorar el uso de una base de datos no relacional para este módulo, que permita registrar cada incidencia con la estructura que mejor se adapte a su tipo, sin forzar un esquema fijo.

Analítica para toma de decisiones (Unidad 3 — arquitecturas de datos en la nube):
Se planea construir un módulo de análisis histórico que permita identificar patrones de uso, equipos con mayor frecuencia de falla y necesidades de inversión. El enfoque y las herramientas concretas de esta unidad se definirán a medida que se avance en los contenidos del curso.

# 👥 Posibles usuarios del sistema
Estudiantes: utilizarán las salas en el marco de sus clases asignadas. No realizarán reservas directas — para trabajo autónomo cuentan con las salas de la biblioteca. Su rol en el sistema será reportar incidencias técnicas durante las sesiones (equipo que no enciende, software que no funciona, restricciones que impiden el desarrollo de la clase).

Docentes: registrarán los requisitos técnicos de sus cursos, solicitarán permisos o software adicional cuando sea necesario, y reportarán incidencias relacionadas con configuraciones que afecten sus clases.

Técnicos de soporte: registrarán y gestionarán mantenimientos, atenderán las incidencias reportadas y administrarán las configuraciones de software por sala.

Coordinación académica / administrativa: gestionará las asignaciones semestrales, consultará reportes analíticos y tomará decisiones de inversión o reposición de equipos.

# 🗂️ Lista preliminar de entidades
Esta lista representa una aproximación inicial al modelo de datos. Se espera que evolucione a medida que se avance en los contenidos del curso.

Sala — identificador, nombre, ubicación, capacidad, estado.

Equipo — identificador, sala a la que pertenece, especificaciones básicas, estado.

Software — nombre, versión, tipo de licencia.

EquipoSoftware — relación entre equipos y software instalado, con nivel de permisos asignado.

Usuario — identificador, tipo (estudiante / docente / técnico / admin), programa académico.

Curso — id, nombre, código, programa académico, docente responsable, semestre.

RequisitoCurso — curso, software o configuración requerida, nivel de permisos necesario, obligatorio u opcional.

AsignacionSemestral — sala, curso, horario fijo (día, hora inicio, hora fin), semestre, perfil de permisos aplicado a la sala.

Mantenimiento — equipo, técnico responsable, fecha, tipo, descripción, estado.

SolicitudPermiso — docente, sala, configuración o software requerido, justificación, estado.

Incidencia — reporte de falla durante una sesión (estructura a definir en la unidad 2).

# 📏 Reglas de negocio
1. Al asignar una sala a un curso, el sistema deberá verificar la compatibilidad entre los requisitos técnicos del curso y la dotación real de la sala (software instalado y niveles de permisos). Si la sala no cumple los requisitos obligatorios del curso, la asignación quedará marcada como "asignada con requisitos pendientes" y generará automáticamente las solicitudes de instalación o permisos correspondientes al área técnica.
2. Al iniciar un nuevo semestre, el sistema deberá generar automáticamente la lista de software y configuraciones a instalar en cada sala, a partir de los cursos asignados y sus requisitos técnicos. Esto entrega al área de sistemas una guía estructurada para la preparación de los equipos, en lugar de depender de solicitudes dispersas o de la memoria de semestres anteriores. 
3. El perfil de permisos de una sala estará asociado a su asignación semestral vigente y solo podrá ser modificado por un administrador, no por docentes ni estudiantes.
Un equipo en estado "en mantenimiento" o "fuera de servicio" no podrá ser contado como parte de la capacidad operativa de una sala al momento de validar una asignación.
4. Toda incidencia reportada durante una sesión de clase deberá ser atendida antes de la siguiente sesión del mismo curso en esa sala. El sistema llevará registro formal de cada incidencia — sala, equipo, clase afectada y estado de atención — para garantizar trazabilidad y evitar que problemas recurrentes queden sin respuesta institucional.
5. La acumulación de incidencias repetidas en un mismo equipo dentro de un período corto deberá generar automáticamente una alerta de mantenimiento, evitando que equipos problemáticos sigan en uso sin intervención técnica.
6. Toda solicitud de permiso o configuración adicional realizada por un docente deberá ser respondida — aprobada o rechazada con justificación — antes de la siguiente sesión del curso solicitante.
7. El sistema llevará registro del estado y tiempo de respuesta de cada solicitud, para que las restricciones que afectan el desarrollo de las clases tengan un canal formal de gestión.
   
# 🤔 ¿Por qué este proyecto es suficientemente complejo?

1. El problema es real y multidimensional:
No se trata de un ejercicio académico genérico. El sistema busca resolver una situación concreta que ocurre en la propia institución, con usuarios reales, restricciones reales y decisiones reales de por medio. Eso implica modelar matices que no aparecen en ejemplos de libro.

2. Lógica de compatibilidad entre necesidades y recursos:
El sistema deberá cruzar los requisitos técnicos de cada curso contra la dotación real de cada sala (software instalado y niveles de permisos), detectar brechas y generar acciones a partir de ellas — solicitudes automáticas al área técnica, alertas de incompatibilidad, seguimiento de resolución. Esta lógica va más allá del CRUD básico.

3. Datos de distinta naturaleza que justifican distintas tecnologías:
Las operaciones transaccionales (asignaciones, mantenimientos, solicitudes) y los eventos variables (incidencias) tienen características distintas que justifican aproximaciones diferentes al almacenamiento, lo cual conecta directamente con los objetivos del curso.

4. Orientación a decisiones reales:
El módulo analítico no será decorativo — buscará responder preguntas concretas: qué equipos deben reemplazarse, qué horarios tienen mayor demanda, qué cursos generan más incidencias. Información que una coordinación académica real necesitaría para tomar decisiones de inversión.
# Política de uso de IA
Herramientas utilizadas: Claude (Anthropic).

Cómo se ha usado hasta ahora:
Durante la fase de definición del proyecto se utilizó IA para explorar distintos dominios posibles y evaluar su viabilidad. La herramienta propuso varios enfoques que fueron descartados por no reflejar un problema cercano o suficientemente real. La selección final del dominio surgió de la experiencia directa de la autora como estudiante de la institución. La IA también se usó para orientar qué tipos de tecnologías podrían ser adecuadas para cada módulo del sistema — una decisión que la autora no podía tomar con certeza por no haber cursado aún las unidades 2 y 3. Esa orientación tecnológica se tomó como punto de partida provisional, sujeta a ajuste a medida que avance el curso.

Usos planificados durante el desarrollo:

Apoyo en la escritura de consultas y estructuras técnicas, las cuales serán revisadas y comprendidas antes de incorporarse.
Generación de datos de prueba para poblar las bases de datos.
Revisión y retroalimentación sobre decisiones de modelado.

Ejemplos de prompts utilizados:

Los siguientes son ejemplos representativos del tipo de consultas realizadas a la IA durante la definición del proyecto. En todos los casos, el contexto y el problema fueron aportados por la autora, y la IA se usó para validar, refinar o resolver dudas puntuales:

"En esa clase el profe se quejaba de un problema real en la universidad: las salas de cómputo tienen software instalado pero con permisos restringidos que no dejan configurar cosas en clase. Quiero construir mi proyecto de bases de datos sobre esto. ¿Este problema da para usar bases de datos relacionales, no relacionales y análisis de datos, o se queda corto? Aparte quiero que me sugieras más ideas por si el mío no sirve para el uso de las bases de datos que ya te mencioné."

"El sistema académico de mi universidad ya permite reservar salas, así que no quiero duplicar eso. Mi enfoque sería el cruce entre lo que cada materia necesita y lo que cada sala realmente tiene. ¿Cómo modelo los requisitos técnicos de un curso como entidad?"

"Los estudiantes en mi universidad no reservan salas porque usan las de la biblioteca. ¿Cómo debería ajustar el rol del estudiante en mi sistema para que sea coherente con eso?"

Compromisos:

Todo lo generado con IA será revisado y comprendido por la autora antes de ser commiteado.

En la defensa oral se podrán explicar y justificar todas las decisiones de diseño.

Los prompts utilizados se documentarán progresivamente en un documento aprte según lo requiera el profesor.
