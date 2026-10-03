@echo off
chcp 65001 >nul
title Configurar, Auditar, Construir, Respaldar y Desplegar - Mano Fil Cobertores
color 0A

echo =========================================================================
echo    SISTEMA INTEGRAL: AUDITORÍA, BUILD, DEPLOY Y RESPALDO (GIT Y USB D:)
echo    Mano Fil S.A. - Cobertores.com
echo =========================================================================
echo.

cd /d "D:\COBERTORES"

echo [PASO 1/5] Verificando entorno y proyecto Firebase...
call firebase use cobertores-web
if %errorlevel% neq 0 (
    echo.
    echo [ALERTA] Sesión de Firebase requiere renovación.
    echo Ejecutando reautenticación...
    call "REAUTENTICAR_GOOGLE_Y_FIREBASE.bat"
)

echo.
echo [PASO 2/5] Compilando proyecto Next.js (Generando out/ con sitemap y robots)...
call "build_fast.bat"
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] La compilación de Next.js falló. Revisa los errores arriba.
    pause
    exit /b %errorlevel%
)

echo.
echo [PASO 3/5] Desplegando a Firebase Hosting, Reglas de Firestore y Storage...
call firebase deploy --only hosting,firestore:rules,storage
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] El despliegue a Firebase falló.
    pause
    exit /b %errorlevel%
)

echo.
echo [PASO 4/5] Creando Respaldo Completo en USB D:...
for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss"') do set datetime=%%I
if "%datetime%"=="" set datetime=%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set datetime=%datetime: =0%
set BACKUP_DIR=D:\RESPALDOS_COBERTORES\RESPALDO_%datetime%

echo Destino: %BACKUP_DIR%
mkdir "%BACKUP_DIR%" 2>nul

echo Copiando archivos del proyecto (excluyendo node_modules, .next y cache)...
robocopy "D:\COBERTORES" "%BACKUP_DIR%" /E /XD "node_modules" ".next" ".git" "playwright-report" "test-results" /XF "*.log" /NFL /NDL /NJH /NJS

echo Respaldo en USB D: completado en %BACKUP_DIR%

echo.
echo [PASO 5/5] Respaldando y Sincronizando con Repositorio Git (GitHub)...
call git add .
call git commit -m "chore(sync): sincronizacion de proyecto y deploy a produccion"
call git push origin main
if %errorlevel% neq 0 (
    echo [AVISO] Git push con 'main' tuvo código %errorlevel%, intentando con rama activa...
    call git push origin HEAD
)

echo.
echo =========================================================================
echo    ¡PROCESO COMPLETADO EXITOSAMENTE!
echo    1. Build generado y optimizado para Googlebot.
echo    2. Despliegue en producción completado (cobertores.com).
echo    3. Respaldo local guardado en: %BACKUP_DIR%
echo    4. Cambios respaldados y subidos a GitHub.
echo =========================================================================
echo.
pause
