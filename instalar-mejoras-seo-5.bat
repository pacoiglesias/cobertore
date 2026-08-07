@echo off
setlocal enabledelayedexpansion
title Instalador de mejoras SEO - Ronda 5 (noindex intranet) - cobertores.com

echo ============================================================
echo   Instalador de mejoras SEO - Ronda 5 - cobertores.com
echo ============================================================
echo.
echo   Este script:
echo    1. Extrae cobertore_seo_mejoras_5.zip
echo    2. Crea src\app\intranet\layout.tsx (noindex del portal privado,
echo       ese archivo no existia antes, no hay nada que respaldar)
echo    3. (opcional) Compila y despliega el sitio a Firebase Hosting
echo.

if not exist "next.config.ts" (
    echo [ERROR] No se encontro next.config.ts en esta carpeta.
    echo         Coloca este .bat en la RAIZ del proyecto ^(junto a package.json^)
    echo         y vuelve a ejecutarlo desde ahi.
    echo.
    pause
    exit /b 1
)

set "ZIPFILE=cobertore_seo_mejoras_5.zip"
if not exist "%ZIPFILE%" (
    echo [ERROR] No se encontro "%ZIPFILE%" en esta carpeta.
    echo         Descarga el zip que te di y colocalo junto a este .bat
    echo         ^(en la raiz del proyecto^), luego vuelve a correrlo.
    echo.
    pause
    exit /b 1
)

if not exist "src\app\intranet" (
    echo [ERROR] No se encontro la carpeta src\app\intranet
    echo         Este script es para el proyecto de cobertores.com.
    echo         Verifica que estas en la carpeta correcta.
    echo.
    pause
    exit /b 1
)

set "RESCATE_DIR=%TEMP%\cobertore-respaldos-sueltos"
for /d %%D in ("respaldos\pre-seo-*") do (
    if exist "%%D\src" (
        echo [FIX] Moviendo respaldo suelto anterior fuera del proyecto: %%D
        if not exist "%RESCATE_DIR%" mkdir "%RESCATE_DIR%"
        move "%%D" "%RESCATE_DIR%\" >nul 2>&1
    )
)

echo ===== Paso 1/3: Extrayendo %ZIPFILE% a una carpeta temporal =====
set "TEMP_DIR=%TEMP%\cobertore_seo5_%RANDOM%"
powershell -NoProfile -Command "Expand-Archive -LiteralPath '%CD%\%ZIPFILE%' -DestinationPath '%TEMP_DIR%' -Force"
if errorlevel 1 (
    echo [ERROR] No se pudo extraer el zip. Verifica que no este dañado.
    pause
    exit /b 1
)
echo   OK - zip extraido.

echo.
echo ===== Paso 2/3: Copiando el archivo nuevo al proyecto =====
xcopy /Y /I "%TEMP_DIR%\src\app\intranet\layout.tsx" "src\app\intranet\" >nul
if errorlevel 1 (
    echo   [ERROR] La copia fallo.
    pause
    exit /b 1
)
rmdir /S /Q "%TEMP_DIR%" 2>nul
echo   OK - src\app\intranet\layout.tsx creado.

echo.
echo ===== Paso 3/3: Compilar y desplegar =====
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
    pause
    exit /b 1
)
echo   OK - build exitoso.

echo.
echo   ----- Desplegando a Firebase Hosting -----
call firebase deploy --only hosting
if errorlevel 1 (
    echo   [ERROR] El deploy fallo. Copia todo lo de arriba y revisalo.
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
echo   TODO LISTO.
echo ============================================================
echo.
pause
