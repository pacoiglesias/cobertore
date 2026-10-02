@echo off
set "SOURCE_DIR=D:\COBERTORES"
set "BUILD_DIR=%TEMP%\cobertores_fast_build"

echo =========================================================================
echo    COMPILACION RAPIDA NEXT.JS (EN DISCO LOCAL NVMe C:)
echo =========================================================================

if not exist "%BUILD_DIR%" mkdir "%BUILD_DIR%" 2>nul

echo [1/4] Sincronizando codigo fuente en C: (NVMe ultra-rapido)...
robocopy "%SOURCE_DIR%" "%BUILD_DIR%" /E /XD node_modules .next .git playwright-report test-results out /XF *.log /NFL /NDL /NJH /NJS

if not exist "%BUILD_DIR%\node_modules" (
    echo [2/4] Instalando dependencias en disco local C:...
    cd /d "%BUILD_DIR%"
    call npm install --prefer-offline --no-audit
) else (
    echo [2/4] Dependencias listas en disco C:...
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
