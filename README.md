# SalaTrack — Sistema de Gestión y Análisis de Salas de Cómputo

Proyecto del curso Bases de Datos Avanzadas — Universidad Católica Luis Amigó
Docente: Juan Felipe Muñoz Fernández

Participantes y roles
Usuario GitHub	Rol
@sarasanchezes-bot	Líder de desarrollo - Diseño de BD - Analítica

# Descripción del problema

Las salas de cómputo de la Universidad Católica Luis Amigó son un recurso compartido y crítico para el desarrollo de clases prácticas y laboratorios. En la práctica, su gestión presenta problemas reales y frecuentes: equipos con restricciones de permisos que impiden realizar configuraciones necesarias para las sesiones académicas, ausencia de un sistema centralizado que diferencie entre asignaciones fijas por curso y reservas puntuales de docentes, incidencias repetidas en los mismos equipos sin seguimiento formal, y falta de datos históricos que permitan tomar decisiones de mantenimiento o reposición.

Un problema concreto y recurrente es que las salas asignadas a cursos durante todo el semestre reciben el software requerido por cada materia, instalado por el área de sistemas según la solicitud del docente. Sin embargo, dicha instalación se realiza con restricciones de permisos que limitan lo que el docente y los estudiantes pueden hacer durante la clase: no es posible modificar configuraciones del sistema, habilitar protocolos, instalar herramientas adicionales ni ajustar parámetros necesarios para el desarrollo normal de las sesiones. Esto genera fricciones operativas directas — como la imposibilidad de habilitar conexiones TCP en un motor de base de datos o de instalar extensiones requeridas — sin que exista un canal formal para reportar, escalar o resolver esas restricciones durante el semestre.

SalaTrack será un sistema backend que centralizará tanto la gestión operativa como la planificación semestral de las salas de cómputo, y producirá información analítica para la toma de decisiones institucionales. El sistema buscará integrar distintas aproximaciones al almacenamiento de datos según la naturaleza de cada tipo de información, combinando operaciones transaccionales, registro flexible de eventos e información histórica para análisis.

En cuanto a su alcance, el sistema se enfocará en las salas de cómputo destinadas a clases y laboratorios de la institución, cubriendo su asignación por curso durante el semestre, las reservas puntuales de docentes, el registro y seguimiento de incidencias durante las sesiones, la gestión de mantenimientos y el análisis histórico de uso. Queda fuera del alcance la gestión de las salas de la biblioteca (de uso libre para estudiantes) y la administración de red o infraestructura física de los equipos, que corresponde al área de sistemas de la universidad.

# Solución propuesta por unidades

El sistema abordará el problema en tres grandes módulos, cada uno con la tecnología más adecuada según lo visto en el curso:

Gestión operativa (Unidad 1 — SQL Server):
Se planea modelar y gestionar salas, equipos, usuarios, asignaciones semestrales por curso, reservas puntuales de docentes y mantenimientos. Esta parte del sistema requerirá integridad transaccional, por lo que se trabajará sobre una base de datos relacional. Se explorarán herramientas avanzadas de SQL Server como stored procedures, triggers y CTEs a medida que se avance en el curso.

Registro de eventos e incidencias (Unidad 2 — bases de datos no relacionales):
Las incidencias reportadas durante las sesiones de clase son datos de naturaleza variable: una falla de hardware no tiene los mismos campos que un problema de permisos o un error de software. Por esta razón se planea explorar el uso de una base de datos no relacional para este módulo, que permita registrar cada incidencia con la estructura que mejor se adapte a su tipo, sin forzar un esquema fijo.

Analítica para toma de decisiones (Unidad 3 — arquitecturas de datos en la nube):
Se planea construir un módulo de análisis histórico que permita identificar patrones de uso, equipos con mayor frecuencia de falla y necesidades de inversión. El enfoque y las herramientas concretas de esta unidad se definirán a medida que se avance en los contenidos del curso.

# Posibles usuarios del sistema
Estudiantes: utilizarán las salas en el marco de sus clases asignadas. No realizarán reservas directas — para trabajo autónomo cuentan con las salas de la biblioteca. Su rol en el sistema será reportar incidencias técnicas durante las sesiones (equipo que no enciende, software que no funciona, restricciones que impiden el desarrollo de la clase).
Docentes: podrán realizar reservas puntuales de salas para sesiones adicionales fuera de su asignación semestral, y reportar incidencias relacionadas con permisos o configuraciones de software.
Técnicos de soporte: registrarán y gestionarán mantenimientos, atenderán incidencias escaladas y administrarán las configuraciones de software por sala.
Coordinación académica / administrativa: gestionará las asignaciones semestrales, consultará reportes analíticos y tomará decisiones de inversión o reposición de equipos.

# Lista preliminar de entidades

Esta lista representa una aproximación inicial al modelo de datos. Se espera que evolucione a medida que se avance en los contenidos del curso.

Sala: identificador, nombre, ubicación, capacidad, estado.
Equipo: identificador, sala a la que pertenece, especificaciones básicas, estado. 
Software: nombre, versión, tipo de licencia
EquipoSoftware: relación entre equipos y software instalado, con nivel de permisos asignado.
Usuario: identificador, tipo (estudiante / docente / técnico / admin), programa académico
Curso: nombre, código, programa académico, docente responsable, semestre.
AsignacionSemestral: sala, curso, horario fijo (día, hora inicio, hora fin), semestre, perfil de permisos aplicado a la sala.
Reserva: docente, sala, fecha y horario, estado.
Mantenimiento: equipo, técnico responsable, fecha, tipo, descripción, estado.
SolicitudPermiso: docente, sala, configuración o software requerido, justificación, estado.
Incidencia: reporte de falla durante una sesión (estructura a definir en la unidad 2).

# Reglas de negocio
1. Una sala con asignación semestral activa no podrá recibir reservas puntuales en ese bloque horario. Ningún docente podrá reservar una sala en un horario que ya esté asignado a un curso durante el semestre.
2. El perfil de permisos de una sala estará asociado a su asignación semestral vigente y solo podrá ser modificado por un administrador, no por docentes ni estudiantes.
3. Un equipo en estado "en mantenimiento" o "fuera de servicio" no podrá ser incluido en asignaciones ni reservas activas.
4. Toda incidencia reportada durante una sesión de clase deberá ser atendida antes de la siguiente sesión del mismo curso en esa sala. El sistema llevará registro formal de cada incidencia — sala, equipo, clase afectada y estado de atención — para garantizar trazabilidad y evitar que problemas recurrentes queden sin respuesta institucional.
5. La acumulación de incidencias repetidas en un mismo equipo dentro de un período corto deberá generar automáticamente una alerta de mantenimiento, evitando que equipos problemáticos sigan en uso sin intervención técnica.
6. Las reservas puntuales de docentes que no sean confirmadas con suficiente antelación se cancelarán automáticamente, liberando el recurso para otros usos.
7. Toda solicitud de permiso o configuración adicional realizada por un docente deberá ser respondida — aprobada o rechazada con justificación — antes de la siguiente sesión del curso solicitante. El sistema llevará registro del estado y tiempo de respuesta de cada solicitud, para que las restricciones que afectan el desarrollo de las clases tengan un canal formal de gestión.

 # ¿Por qué este proyecto es suficientemente complejo?

1. El problema es real y multidimensional:
No se trata de un ejercicio académico genérico. El sistema busca resolver una situación concreta que ocurre en la propia institución, con usuarios reales, restricciones reales y decisiones reales de por medio. Eso implica modelar matices que no aparecen en ejemplos de libro.

2. Coexistencia de dos modelos de ocupación con lógica de conflicto:
El sistema deberá gestionar simultáneamente asignaciones semestrales fijas y reservas puntuales eventuales, con reglas que determinen cuándo una bloquea a la otra. Esta lógica no es trivial y requerirá validaciones que van más allá del CRUD básico.

3. Datos de distinta naturaleza que justifican distintas tecnologías:
Las operaciones transaccionales (reservas, mantenimientos) y los eventos variables (incidencias) tienen características distintas que justifican aproximaciones diferentes al almacenamiento, lo cual conecta directamente con los objetivos del curso.

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

"En mi universidad las salas se asignan a un curso durante todo el semestre, pero los docentes también pueden pedir salas sueltas para clases extra. ¿Tiene sentido modelar la asignación semestral como una entidad distinta de la reserva puntual, o las uno en una sola tabla?"

"Los estudiantes en mi universidad no reservan salas porque usan las de la biblioteca. ¿Cómo debería ajustar el rol del estudiante en mi sistema para que sea coherente con eso?"

Compromisos:

Todo lo generado con IA será revisado y comprendido por la autora antes de ser commiteado.
En la defensa oral se podrán explicar y justificar todas las decisiones de diseño.
Los prompts utilizados se documentarán progresivamente en un documento aprte según lo requiera el profesor.
