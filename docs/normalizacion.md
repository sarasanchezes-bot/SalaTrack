# Justificación de Normalización (Tercera Forma Normal - 3FN)

En este documento se justifica por qué el diseño relacional de la base de datos **SalaTrack** cumple con las reglas de la Primera (1FN), Segunda (2FN) y Tercera Forma Normal (3FN) para sus 13 tablas, según la estructura del DDL físico actual.

---

## 1. Criterios Generales de Normalización

* **Primera Forma Normal (1FN):** Todos los atributos contienen valores atómicos (indivisibles) y no existen grupos repetidos.
* **Segunda Forma Normal (2FN):** La tabla está en 1FN y todos los atributos no clave dependen totalmente de la clave primaria (PK) completa.
* **Tercera Forma Normal (3FN):** La tabla está en 2FN y no existen dependencias transitivas (ningún atributo no clave depende de otro atributo no clave).

---

## 2. Justificación Tabla por Tabla

### 1. `Sala`
* **Atributos:** `sala_id` (PK), `nombre`, `ubicacion`, `capacidad`, `estado`.
* **Cumplimiento 3FN:** Todos los atributos dependen de manera directa y única de `sala_id`. No existen atributos transitivos.

### 2. `Equipo`
* **Atributos:** `equipo_id` (PK), `sala_id` (FK), `especificaciones`, `estado`.
* **Cumplimiento 3FN:** `sala_id` es una FK bien definida. Los atributos `especificaciones` y `estado` son atómicos y dependen únicamente de `equipo_id`.

### 3. `Software`
* **Atributos:** `software_id` (PK), `nombre`, `version`, `tipo_licencia`.
* **Cumplimiento 3FN:** Cada atributo describe el software registrado y depende directamente de su `software_id`.

### 4. `EquipoSoftware`
* **Atributos:** `equipo_id` (PK, FK), `software_id` (PK, FK), `nivel_permisos`.
* **Cumplimiento 3FN:** Tiene clave primaria compuesta (`equipo_id`, `software_id`). El campo `nivel_permisos` depende de la combinación completa de ambas claves (2FN). No existen dependencias transitivas (3FN).

### 5. `Curso`
* **Atributos:** `curso_id` (PK), `nombre`, `codigo`, `programa_academico`, `docente_responsable`, `semestre`.
* **Cumplimiento 3FN:** `curso_id` identifica unívocamente al curso. Todos los demás campos dependen únicamente de esta clave.

### 6. `RequisitoCurso`
* **Atributos:** `requisito_curso_id` (PK), `curso_id` (FK), `software_id` (FK), `descripcion_configuracion`, `nivel_permiso_necesario`, `es_obligatorio`.
* **Cumplimiento 3FN:** La relación curso-software se identifica de forma única por la clave primaria `requisito_curso_id`. Todos los atributos dependen únicamente de esta PK.

### 7. `AsignacionSemestral`
* **Atributos:** `asignacion_id` (PK), `sala_id` (FK), `curso_id` (FK), `semestre`, `dia_semana`, `hora_inicio`, `hora_fin`, `perfil_permisos`, `estado`.
* **Cumplimiento 3FN:** Cada franja/reserva se identifica por `asignacion_id`. No hay dependencias transitivas entre la sala, el curso y los horarios.

### 8. `Tecnico`
* **Atributos:** `tecnico_id` (PK), `nombre`, `especialidad`, `activo`.
* **Cumplimiento 3FN:** Atributos atómicos del personal técnico. Todos dependen directamente de `tecnico_id`. No incluye columnas redundantes ni de contacto secundario.

### 9. `Mantenimiento`
* **Atributos:** `mantenimiento_id` (PK), `equipo_id` (FK), `tecnico_id` (FK), `fecha_mantenimiento`, `tipo_mantenimiento`, `descripcion`, `costo`, `estado`.
* **Cumplimiento 3FN:** Relaciona el equipo mantenido y el técnico asignado. Los detalles del trabajo (`tipo_mantenimiento`, `costo`, `estado`) dependen directamente de `mantenimiento_id`.

### 10. `SolicitudPermiso`
* **Atributos:** `solicitud_id` (PK), `curso_id` (FK), `software_solicitado`, `fecha_solicitud`, `estado`, `justificacion`.
* **Cumplimiento 3FN:** El software se registra como texto libre (`software_solicitado`) sin relación FK estricta a la tabla `Software` para permitir solicitudes de programas no parametrizados aún en el sistema. Todos los campos dependen unívocamente de `solicitud_id`.

### 11. `HistorialSolicitud`
* **Atributos:** `historial_id` (PK), `solicitud_id` (FK), `fecha_cambio`, `estado_anterior`, `estado_nuevo`.
* **Cumplimiento 3FN:** Tabla de auditoría atómica para rastrear transiciones de estado. Cada registro depende exclusivamente de `historial_id`.

### 12. `RequisitoPendiente`
* **Atributos:** `pendiente_id` (PK), `asignacion_id` (FK), `requisito_curso_id` (FK), `motivo`, `detalle`, `fecha_deteccion`, `estado`.
* **Cumplimiento 3FN:** Registra la falta o inconsistencia de software detectada. Incluye los campos atómicos `motivo` (validado mediante restricción CHECK para categorizar el tipo de pendiente) y `detalle` (descripción específica). Se conecta directamente con la asignación semestral y el requisito del curso sin duplicar datos del software o la sala. Toda la información del registro depende unívocamente de `pendiente_id`.

### 13. `Incidencia`
* **Atributos:** `incidencia_id` (PK), `equipo_id` (FK), `descripcion`, `fecha_reporte`, `fecha_cierre`, `estado`.
* **Cumplimiento 3FN:** **Nota de diseño:** Esta tabla se mantiene estructuralmente mínima a propósito dentro del modelo relacional en SQL Server. La gestión documental compleja de incidencias se migrará a MongoDB en la Unidad 2. Cumple 3FN ya que sus atributos actuales dependen directamente de `incidencia_id`.

---
*( Se excluye la tabla `Usuario` ya que no fue implementada físicamente en la base de datos).*