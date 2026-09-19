#!/bin/bash
# ============================================================
# SalaTrack — Genera 00_deploy_all_flat.sql
# ============================================================
# Plan B por si SQLCMD mode no queda activado en VS Code:
# concatena los mismos archivos, en el mismo orden que
# 00_deploy_all.sql, en un unico .sql que se ejecuta tal cual.
#
# Uso (desde la carpeta sql-server/):
#   bash build_deploy_flat.sh
# ============================================================

set -e
cd "$(dirname "$0")"

ORDEN=(
  schema/01_schema_nucleo_fisico.sql
  schema/02_curso_requisitocurso_asignacionsemestral.sql
  schema/03_fix_estado_asignacion.sql
  schema/04_tecnico.sql
  schema/05_mantenimiento.sql
  schema/06_solicitud_permiso.sql
  schema/07_historial_solicitud.sql
  schema/08_requisito_pendiente.sql
  schema/09_incidencia.sql
  seeds/01_seeds_nucleo_fisico.sql
  seeds/02_seeds_nucleo_academico.sql
  seeds/03_seeds_mantenimiento.sql
  seeds/04_seeds_solicitud_permiso.sql
  views/verificar_compatibilidad.sql
  views/requisitos_por_curso.sql
  views/lista_instalacion.sql
  functions/01_fn_requisitos_pendientes_sala.sql
  procedures/11_sp_asignar_curso_sala.sql
  procedures/12_sp_registrar_mantenimiento.sql
  procedures/13_sp_generar_lista_instalacion.sql
  procedures/sp_registrar_solicitud_permiso.sql
  triggers/01_trg_mantenimiento_actualiza_equipo.sql
  triggers/02_trg_historial_solicitud.sql
)

SALIDA=00_deploy_all_flat.sql

{
  echo "-- Generado por build_deploy_flat.sh — NO editar a mano."
  echo "-- Para cambiar el contenido, edita los archivos fuente y vuelve a correr el script."
  echo ""
  echo "USE master;"
  echo "GO"
  echo "IF DB_ID('SalaTrack') IS NOT NULL"
  echo "BEGIN"
  echo "    ALTER DATABASE SalaTrack SET SINGLE_USER WITH ROLLBACK IMMEDIATE;"
  echo "    DROP DATABASE SalaTrack;"
  echo "END;"
  echo "GO"
  echo "CREATE DATABASE SalaTrack;"
  echo "GO"
  echo "USE SalaTrack;"
  echo "GO"
  echo ""

  for f in "${ORDEN[@]}"; do
    if [ ! -f "$f" ]; then
      echo "FALTA EL ARCHIVO: $f" >&2
      exit 1
    fi
    echo "-- ============================================================"
    echo "-- $f"
    echo "-- ============================================================"
    cat "$f"
    echo ""
    echo "GO"
    echo ""
  done
} > "$SALIDA"

echo "Generado $SALIDA con ${#ORDEN[@]} archivos."
