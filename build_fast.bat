@echo off
set "SOURCE_DIR=D:\COBERTORES"
set "BUILD_DIR=%TEMP%\cobertores_fast_build"

echo =========================================================================
echo    COMPILACION RAPIDA NEXT.JS (EN DISCO LOCAL NVMe C:)
echo =========================================================================

if exist "%BUILD_DIR%" (
    echo Limpiando compilacion anterior en Temp...
    if exist "%BUILD_DIR%\node_modules" rmdir "%BUILD_DIR%\node_modules" 2>nul
    rmdir /s /q "%BUILD_DIR%" 2>nul
)

mkdir "%BUILD_DIR%" 2>nul

echo [1/4] Copiando codigo fuente a disco local C:...
robocopy "%SOURCE_DIR%" "%BUILD_DIR%" /E /XD node_modules .next .git playwright-report test-results out /XF *.log /NFL /NDL /NJH /NJS

echo [2/4] Enlazando node_modules de forma directa...
mklink /J "%BUILD_DIR%\node_modules" "%SOURCE_DIR%\node_modules" >nul
if errorlevel 1 (
    echo Error al crear enlace a node_modules.
    exit /b 1
)

echo [3/4] Compilando con Next.js (SSG Export)...
cd /d "%BUILD_DIR%"
call npm run build
if errorlevel 1 (
    echo [ERROR] La compilacion fallo.
    cd /d "%SOURCE_DIR%"
    exit /b 1
)

echo [4/4] Copiando carpeta estatica out/ a %SOURCE_DIR%\out...
cd /d "%SOURCE_DIR%"
robocopy "%BUILD_DIR%\out" "%SOURCE_DIR%\out" /E /NFL /NDL /NJH /NJS

echo =========================================================================
echo    COMPILACION COMPLETADA CON EXITO EN out/!
echo =========================================================================
exit /b 0
