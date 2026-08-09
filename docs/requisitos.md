# Documento de Requisitos — SalaTrack

**Proyecto:** SalaTrack — Sistema de Gestión y Análisis de Salas de Cómputo
**Curso:** Bases de Datos Avanzadas — Universidad Católica Luis Amigó
**Versión:** 1.0

---

## 1. Introducción

Este documento describe los requisitos del sistema SalaTrack, una plataforma backend orientada a la gestión y análisis de las salas de cómputo de la Universidad Católica Luis Amigó. El sistema busca registrar qué ofrece cada sala, qué requiere cada curso y qué ocurre durante las sesiones de clase, con el fin de producir información que apoye la toma de decisiones institucionales.

## 2. Propósito

Proveer a la institución una fuente estructurada de información que permita verificar si las salas de cómputo cumplen con los requisitos técnicos de cada materia, llevar registro de las incidencias y sustentar decisiones de mantenimiento e inversión con base en datos históricos.

## 3. Alcance

El sistema cubre la gestión de salas de clases y laboratorios, incluyendo:
- Registro de salas, equipos y software instalado.
- Registro de cursos y sus requisitos técnicos.
- Verificación de compatibilidad entre requisitos de cursos y dotación de salas.
- Registro y seguimiento de incidencias durante las sesiones.
- Gestión de mantenimientos y solicitudes de permisos.
- Análisis histórico para la toma de decisiones.

Queda fuera del alcance la reserva puntual de salas (gestionada por el sistema académico), la administración de las salas de la biblioteca y la gestión de red e infraestructura física de los equipos.

## 4. Requisitos funcionales

| ID | Requisito |
|---|---|
| RF-01 | El sistema debe permitir registrar, consultar, actualizar y eliminar salas de cómputo con sus atributos (nombre, ubicación, capacidad, estado). |
| RF-02 | El sistema debe permitir registrar los equipos pertenecientes a cada sala con sus especificaciones y estado. |
| RF-03 | El sistema debe permitir registrar el software instalado en cada equipo, incluyendo su versión y el nivel de permisos asignado. |
| RF-04 | El sistema debe permitir registrar cursos con su docente responsable, programa académico y semestre. |
| RF-05 | El sistema debe permitir registrar los requisitos técnicos de cada curso (software y configuraciones necesarias), indicando si son obligatorios u opcionales. |
| RF-06 | El sistema debe verificar la compatibilidad entre los requisitos técnicos de un curso y la dotación real de una sala al momento de crear una asignación semestral. |
| RF-07 | El sistema debe generar automáticamente, al inicio de cada semestre, la lista de software y configuraciones a instalar en cada sala según los cursos asignados. |
| RF-08 | El sistema debe permitir registrar incidencias reportadas durante las sesiones de clase, con estructura variable según el tipo de incidencia. |
| RF-09 | El sistema debe permitir registrar y gestionar los mantenimientos de los equipos, indicando el técnico responsable, tipo y estado. |
| RF-10 | El sistema debe permitir registrar solicitudes de permisos o software adicional realizadas por los docentes, con su justificación y estado. |
| RF-11 | El sistema debe generar reportes analíticos sobre el uso de las salas, la frecuencia de fallas por equipo y las materias más afectadas, para apoyar decisiones de inversión. |

## 5. Requisitos no funcionales

| ID | Requisito |
|---|---|
| RNF-01 | **Integridad:** las operaciones transaccionales (asignaciones, mantenimientos, solicitudes) deben garantizar la integridad de los datos mediante un motor relacional (SQL Server). |
| RNF-02 | **Flexibilidad de esquema:** el registro de incidencias, de estructura variable, debe manejarse mediante una base de datos documental (MongoDB) que no obligue a un esquema fijo. |
| RNF-03 | **Trazabilidad:** toda incidencia y solicitud debe quedar registrada con su estado y fecha, permitiendo su seguimiento a lo largo del tiempo. |
| RNF-04 | **Escalabilidad analítica:** el análisis histórico debe apoyarse en una arquitectura de datos adecuada para el manejo de grandes volúmenes (Data Warehouse). |
| RNF-05 | **Idoneidad tecnológica:** cada módulo debe emplear la tecnología de almacenamiento más adecuada según la naturaleza de sus datos. |
| RNF-06 | **Mantenibilidad:** el código y la estructura del proyecto deben estar organizados y documentados para facilitar el trabajo colaborativo. |

## 6. Restricciones

- El módulo relacional debe implementarse en **Microsoft SQL Server**.
- El módulo documental debe implementarse en **MongoDB**.
- El código debe gestionarse en un repositorio Git público en GitHub, con rama principal protegida y flujo de trabajo por pull requests.
- El desarrollo se realiza de forma incremental a lo largo de las tres unidades del curso.

## 7. Usuarios del sistema

| Usuario | Rol |
|---|---|
| Estudiantes | Reportan incidencias técnicas durante las sesiones. |
| Docentes | Registran requisitos de sus cursos, solicitan permisos y reportan incidencias. |
| Técnicos de soporte | Gestionan mantenimientos, atienden incidencias y administran configuraciones. |
| Coordinación académica | Gestiona asignaciones, consulta reportes y toma decisiones de inversión. |

---

*Documento de requisitos versión 1.0 — sujeto a ajustes a medida que avanza el proyecto.*
