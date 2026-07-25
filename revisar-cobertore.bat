@echo off
setlocal enabledelayedexpansion
cd /d C:\Users\pacoi\Downloads\cobertore

REM ============================================================
REM  REVISAR-COBERTORE.BAT
REM  Chequeo de salud del proyecto. NO hace commit, NO hace push,
REM  NO despliega nada -- es solo diagnostico, seguro de correr
REM  en cualquier momento, cuantas veces quieras.
REM
REM  Corre esto:
REM   - Antes de pedirle a Claude o a Claude Code que revise algo,
REM     para ya tener el reporte listo
REM   - Despues de aplicar un zip de cambios, para confirmar que
REM     todo sigue sano antes de desplegar
REM   - Cada tanto, como chequeo de rutina
REM
REM  Deja un reporte en revisiones\revision-AAAA-MM-DD_HHMM.txt
REM  con TODO lo que encontro, para que se lo puedas pegar a Claude
REM  tal cual si algo fallo.
REM ============================================================

for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set "dt=%%I"
set "TIMESTAMP=%dt:~0,4%-%dt:~4,2%-%dt:~6,2%_%dt:~8,2%%dt:~10,2%"
if not exist "revisiones" mkdir revisiones
set "REPORTE=revisiones\revision-%TIMESTAMP%.txt"

echo ===== Revision %TIMESTAMP% ===== > "%REPORTE%"
echo. >> "%REPORTE%"

echo.
echo ===== [1/7] Limpiando cache de build (.next, out, functions\lib) =====
REM Sin esto, el build podria decir "exitoso" reusando una compilacion
REM vieja cacheada, sin reflejar tus cambios reales (nos paso una vez).
if exist ".next" rmdir /s /q ".next"
if exist "out" rmdir /s /q "out"
if exist "functions\lib" rmdir /s /q "functions\lib"
echo   OK - cache limpiado.
echo Cache limpiado (.next, out, functions\lib) >> "%REPORTE%"
echo. >> "%REPORTE%"

echo.
echo ===== [2/7] Build del sitio =====
echo --- Build del sitio --- >> "%REPORTE%"
call npm run build >> "%REPORTE%" 2>&1
if errorlevel 1 (
    echo   [FALLO] El build del sitio tiene errores. Ver detalle abajo.
    echo RESULTADO: FALLO >> "%REPORTE%"
) else (
    echo   OK - build del sitio limpio ^(desde cero, sin cache^).
    echo RESULTADO: OK >> "%REPORTE%"
)
echo. >> "%REPORTE%"

echo.
echo ===== [3/7] Build de las Cloud Functions =====
echo --- Build de functions --- >> "%REPORTE%"
cd functions
call npm run build >> "..\%REPORTE%" 2>&1
if errorlevel 1 (
    echo   [FALLO] El build de functions tiene errores.
    echo RESULTADO: FALLO >> "..\%REPORTE%"
) else (
    echo   OK - build de functions limpio ^(desde cero, sin cache^).
    echo RESULTADO: OK >> "..\%REPORTE%"
)
cd ..
echo. >> "%REPORTE%"

echo.
echo ===== [4/7] Chequeo de tipos (TypeScript) =====
echo --- TypeScript (tsc --noEmit) --- >> "%REPORTE%"
call npx tsc --noEmit -p tsconfig.json >> "%REPORTE%" 2>&1
if errorlevel 1 (
    echo   [FALLO] Hay errores de TypeScript.
    echo RESULTADO: FALLO >> "%REPORTE%"
) else (
    echo   OK - sin errores de tipos.
    echo RESULTADO: OK >> "%REPORTE%"
)
echo. >> "%REPORTE%"

echo.
echo ===== [5/7] ESLint =====
echo --- ESLint --- >> "%REPORTE%"
call npx eslint "src/**/*.{ts,tsx}" >> "%REPORTE%" 2>&1
echo (revisa el reporte para el detalle; ESLint no bloquea el resultado general) >> "%REPORTE%"
echo   Hecho - revisa el reporte para el detalle completo.
echo. >> "%REPORTE%"

echo.
echo ===== [6/7] Vulnerabilidades conocidas (npm audit) =====
echo --- npm audit (raiz) --- >> "%REPORTE%"
call npm audit --omit=dev >> "%REPORTE%" 2>&1
echo. >> "%REPORTE%"
echo --- npm audit (functions) --- >> "%REPORTE%"
cd functions
call npm audit --omit=dev >> "..\%REPORTE%" 2>&1
cd ..
echo   Hecho - revisa el reporte para el detalle completo.
echo. >> "%REPORTE%"

echo.
echo ===== [7/7] Estado de git =====
echo --- git status --- >> "%REPORTE%"
git status >> "%REPORTE%" 2>&1
echo --- Ultimos 5 commits --- >> "%REPORTE%"
git log --oneline -5 >> "%REPORTE%" 2>&1
echo   Hecho.
echo.

echo ===== REVISION COMPLETA =====
echo Reporte guardado en: %REPORTE%
echo Si algo fallo arriba, abre ese archivo y pegale el contenido completo a Claude.
echo.
pause
