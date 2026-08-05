@echo off
setlocal enabledelayedexpansion
title Instalador de mejoras SEO - Ronda 2 (schema, breadcrumbs) - cobertores.com

echo ============================================================
echo   Instalador de mejoras SEO - Ronda 2 - cobertores.com
echo ============================================================
echo.
echo   Este script:
echo    1. Respalda los archivos actuales (como .zip, fuera del build)
echo    2. Extrae cobertore_seo_mejoras_2.zip
echo    3. Sobrescribe los 3 archivos con las versiones mejoradas:
echo       - Quita reseñas/precios falsos del schema de productos
echo         ^(riesgo de penalizacion manual de Google^)
echo       - Agrega BreadcrumbList en /noticias
echo       - Corrige un H1 duplicado en /noticias
echo    4. (opcional) Compila y despliega el sitio a Firebase Hosting
echo.

REM --- 1. Verificar que estamos en la raiz del proyecto ---
if not exist "next.config.ts" (
    echo [ERROR] No se encontro next.config.ts en esta carpeta.
    echo         Coloca este .bat en la RAIZ del proyecto ^(junto a package.json^)
    echo         y vuelve a ejecutarlo desde ahi.
    echo.
    pause
    exit /b 1
)

REM --- 2. Verificar que el zip esta presente junto al .bat ---
set "ZIPFILE=cobertore_seo_mejoras_2.zip"
if not exist "%ZIPFILE%" (
    echo [ERROR] No se encontro "%ZIPFILE%" en esta carpeta.
    echo         Descarga el zip que te di y colocalo junto a este .bat
    echo         ^(en la raiz del proyecto^), luego vuelve a correrlo.
    echo.
    pause
    exit /b 1
)

REM --- 3. Verificar que existe la estructura esperada del proyecto ---
if not exist "src\app\[lang]" (
    echo [ERROR] No se encontro la carpeta src\app\[lang]
    echo         Este script es para el proyecto de cobertores.com.
    echo         Verifica que estas en la carpeta correcta.
    echo.
    pause
    exit /b 1
)

REM --- 4. Por si acaso: mover respaldos sueltos de una version vieja del .bat ---
set "RESCATE_DIR=%TEMP%\cobertore-respaldos-sueltos"
for /d %%D in ("respaldos\pre-seo-*") do (
    if exist "%%D\src" (
        echo [FIX] Moviendo respaldo suelto anterior fuera del proyecto: %%D
        if not exist "%RESCATE_DIR%" mkdir "%RESCATE_DIR%"
        move "%%D" "%RESCATE_DIR%\" >nul 2>&1
    )
)

REM --- 5. Timestamp confiable con PowerShell ---
set "TS="
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss"') do set "TS=%%i"
if "%TS%"=="" set "TS=respaldo"

echo ===== Paso 1/4: Respaldando archivos actuales (zip, fuera del build) =====
if not exist "respaldos" mkdir "respaldos"
set "STAGE_DIR=%TEMP%\cobertore_stage2_%RANDOM%"
mkdir "%STAGE_DIR%\src\app\[lang]" 2>nul
mkdir "%STAGE_DIR%\src\app\noticias\[id]" 2>nul

if exist "src\app\[lang]\LandingClient.tsx" copy /Y "src\app\[lang]\LandingClient.tsx" "%STAGE_DIR%\src\app\[lang]\LandingClient.tsx" >nul
if exist "src\app\noticias\page.tsx"        copy /Y "src\app\noticias\page.tsx" "%STAGE_DIR%\src\app\noticias\page.tsx" >nul
if exist "src\app\noticias\[id]\page.tsx"   copy /Y "src\app\noticias\[id]\page.tsx" "%STAGE_DIR%\src\app\noticias\[id]\page.tsx" >nul

set "BACKUP_ZIP=respaldos\pre-seo2-%TS%.zip"
powershell -NoProfile -Command "Compress-Archive -Path '%STAGE_DIR%\*' -DestinationPath '%BACKUP_ZIP%' -Force"
rmdir /S /Q "%STAGE_DIR%" 2>nul
echo   OK - respaldo guardado en %BACKUP_ZIP%

echo.
echo ===== Paso 2/4: Extrayendo %ZIPFILE% a una carpeta temporal =====
set "TEMP_DIR=%TEMP%\cobertore_seo2_%RANDOM%"
powershell -NoProfile -Command "Expand-Archive -LiteralPath '%CD%\%ZIPFILE%' -DestinationPath '%TEMP_DIR%' -Force"
if errorlevel 1 (
    echo [ERROR] No se pudo extraer el zip. Verifica que no este dañado.
    pause
    exit /b 1
)
echo   OK - zip extraido.

echo.
echo ===== Paso 3/4: Copiando los archivos nuevos sobre el proyecto =====
set "OK=1"
xcopy /Y /I "%TEMP_DIR%\src\app\[lang]\LandingClient.tsx" "src\app\[lang]\" >nul        || set "OK=0"
xcopy /Y /I "%TEMP_DIR%\src\app\noticias\page.tsx" "src\app\noticias\" >nul             || set "OK=0"
xcopy /Y /I "%TEMP_DIR%\src\app\noticias\[id]\page.tsx" "src\app\noticias\[id]\" >nul   || set "OK=0"
rmdir /S /Q "%TEMP_DIR%" 2>nul

if "%OK%"=="0" (
    echo   [ADVERTENCIA] Alguna copia pudo haber fallado. Revisa arriba
    echo                 cual archivo no se copio. Tu respaldo esta a salvo
    echo                 en %BACKUP_ZIP%
    pause
    exit /b 1
)
echo   OK - 3 archivos actualizados:
echo     - src\app\[lang]\LandingClient.tsx
echo     - src\app\noticias\page.tsx
echo     - src\app\noticias\[id]\page.tsx
echo   Respaldo de las versiones anteriores en: %BACKUP_ZIP%

echo.
echo ===== Paso 4/4: Compilar y desplegar =====
echo   Estos cambios solo tocan Hosting.
echo.
set /p DEPLOY="  Quieres compilar y desplegar el sitio AHORA? (S/N): "
if /i not "%DEPLOY%"=="S" (
    echo.
    echo   Ok, no se desplego nada. Cuando quieras hacerlo tu mismo:
    echo     npm run build ^&^& firebase deploy --only hosting
    echo.
    pause
    exit /b 0
)

echo.
echo   ----- Verificando sesion de Firebase -----
call firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] Tu sesion de Firebase expiro o no esta instalado el CLI.
    echo           Corre esto primero y vuelve a intentar:
    echo             firebase login --reauth
    pause
    exit /b 1
)
echo   OK - sesion de Firebase activa.

echo.
echo   ----- Instalando dependencias (npm install) -----
call npm install
if errorlevel 1 (
    echo   [ERROR] npm install fallo. Copia todo lo de arriba y revisalo.
    echo   Tu respaldo sigue intacto en: %BACKUP_ZIP%
    pause
    exit /b 1
)
echo   OK - dependencias al dia.

echo.
echo   ----- Limpiando cache de build anterior (.next, out) -----
if exist ".next" rmdir /s /q ".next"
if exist "out" rmdir /s /q "out"
echo   OK - cache limpiado.

echo.
echo   ----- Compilando el sitio (npm run build) -----
call npm run build
if errorlevel 1 (
    echo   [ERROR] El build fallo. Copia todo lo de arriba y revisalo.
    echo   Tu respaldo sigue intacto en: %BACKUP_ZIP%
    pause
    exit /b 1
)
echo   OK - build exitoso.

echo.
echo   ----- Desplegando a Firebase Hosting -----
call firebase deploy --only hosting
if errorlevel 1 (
    echo   [ERROR] El deploy fallo. Copia todo lo de arriba y revisalo.
    echo   Tu respaldo sigue intacto en: %BACKUP_ZIP%
    pause
    exit /b 1
)
echo   OK - deploy exitoso.

echo.
echo   ----- Verificando que el sitio en vivo responda -----
powershell -NoProfile -Command ^
  "try { $r = Invoke-WebRequest -Uri 'https://cobertores-web.web.app/' -UseBasicParsing -TimeoutSec 15; Write-Host ('  OK - el sitio respondio codigo ' + $r.StatusCode) } catch { Write-Host '  [AVISO] No se pudo confirmar que el sitio responda. Revisalo tu manualmente.' }"

echo.
echo ============================================================
echo   TODO LISTO. Revisa https://www.cobertores.com en unos minutos.
echo   Respaldo de este punto: %BACKUP_ZIP%
echo ============================================================
echo.
pause
