@echo off
setlocal enabledelayedexpansion
cd /d C:\Users\pacoi\Downloads\cobertore

REM ============================================================
REM  RESPALDO-COBERTORE.BAT
REM  Crea un punto de restauracion del estado ACTUAL antes de
REM  que toques o despliegues nada. Corre esto:
REM   - Antes de aplicar un zip de cambios nuevo
REM   - Antes de cualquier "firebase deploy"
REM   - Cada vez que algo funcione bien y quieras "guardar el progreso"
REM
REM  Crea DOS respaldos independientes:
REM   1. Un tag de git (backup-AAAA-MM-DD_HHMM), local Y en GitHub
REM   2. Un .zip completo en la carpeta "respaldos\" (sin node_modules)
REM  Si algo sale mal despues, puedes volver a cualquiera de los dos.
REM ============================================================

for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set "dt=%%I"
set "TIMESTAMP=%dt:~0,4%-%dt:~4,2%-%dt:~6,2%_%dt:~8,2%%dt:~10,2%"
set "TAGNAME=backup-%TIMESTAMP%"

echo.
echo ===== Respaldo %TAGNAME% =====
echo.

echo [1/3] Creando tag de git...
git add -A >nul 2>&1
git commit -m "checkpoint antes de respaldo %TIMESTAMP%" >nul 2>&1
git tag "%TAGNAME%"
git push origin "%TAGNAME%" >nul 2>&1
if errorlevel 1 (
    echo   AVISO: no se pudo subir el tag a GitHub ^(puede que ya exista o falte conexion^). El tag local si se creo.
) else (
    echo   OK - tag "%TAGNAME%" creado y subido a GitHub.
)

echo.
echo [2/3] Creando copia .zip local...
if not exist "respaldos" mkdir respaldos
powershell -NoProfile -Command ^
  "Compress-Archive -Path 'src','functions\src','functions\package.json','functions\tsconfig.json','public','firestore.rules','storage.rules','firebase.json','package.json' -DestinationPath 'respaldos\%TAGNAME%.zip' -Force"
if errorlevel 1 (
    echo   [ERROR] No se pudo crear el zip. Revisa el mensaje de arriba.
) else (
    echo   OK - respaldos\%TAGNAME%.zip creado.
)

echo.
echo [3/3] Registrando en el historial de respaldos...
echo %TIMESTAMP% - %TAGNAME% >> respaldos\historial.txt
echo   OK - anotado en respaldos\historial.txt

echo.
echo ===== LISTO =====
echo Para volver a este punto despues:
echo   Con git:  git checkout %TAGNAME%
echo   Con zip:  descomprime respaldos\%TAGNAME%.zip sobre la carpeta del proyecto
echo.
pause
