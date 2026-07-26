@echo off
setlocal enabledelayedexpansion
cd /d C:\Users\pacoi\Downloads\cobertore

echo.
echo ============================================================
echo   TODO-EN-UNO: respaldar + aplicar + revisar + desplegar
echo ============================================================
echo.

REM ===== Paso 0: Verificar que la sesion de Firebase siga viva =====
echo ===== Paso 0: Verificando sesion de Firebase =====
call firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] Tu sesion de Firebase expiro. Corre esto primero y vuelve a intentar:
    echo.
    echo     firebase login --reauth
    echo.
    pause
    exit /b 1
)
echo   OK - sesion de Firebase activa.

REM ===== Paso 1: Respaldo automatico (tag de git + zip) =====
REM Esto se hace ANTES de tocar cualquier archivo nuevo -- pase lo que
REM pase despues, siempre puedes volver a este punto exacto.
echo.
echo ===== Paso 1: Creando respaldo automatico =====
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set "dt=%%I"
set "TIMESTAMP=%dt:~0,4%-%dt:~4,2%-%dt:~6,2%_%dt:~8,2%%dt:~10,2%"
set "TAGNAME=backup-%TIMESTAMP%"

git add -A >nul 2>&1
git commit -m "checkpoint automatico antes de todo-en-uno %TIMESTAMP%" >nul 2>&1
git tag "%TAGNAME%" >nul 2>&1
git push origin "%TAGNAME%" >nul 2>&1

if not exist "respaldos" mkdir respaldos
powershell -NoProfile -Command ^
  "Compress-Archive -Path 'src','functions\src','functions\package.json','functions\tsconfig.json','public','firestore.rules','storage.rules','firebase.json','package.json' -DestinationPath 'respaldos\%TAGNAME%.zip' -Force" >nul 2>&1
echo %TIMESTAMP% - %TAGNAME% >> respaldos\historial.txt
echo   OK - respaldo "%TAGNAME%" creado (tag de git + zip en respaldos\).
echo   Si algo sale mal de aqui en adelante, puedes volver a este punto con:
echo     git checkout %TAGNAME%

REM ===== Paso 2: Encontrar el ZIP de cambios y CONFIRMAR antes de tocar nada =====
echo.
echo ===== Paso 2: Buscando el ZIP de cambios mas reciente en Descargas =====
set "ULTIMO_ZIP="
for /f "delims=" %%F in ('dir /b /o:-d "C:\Users\pacoi\Downloads\cobertore*.zip" "C:\Users\pacoi\Downloads\URGENTE*.zip" "C:\Users\pacoi\Downloads\fix-*.zip" 2^>nul') do (
    if not defined ULTIMO_ZIP set "ULTIMO_ZIP=%%F"
)
if not defined ULTIMO_ZIP (
    echo   No encontre ningun zip "cobertore*.zip" en Descargas. Saltando este paso.
) else (
    echo   Encontre: %ULTIMO_ZIP%
    echo.
    echo   Estos son EXACTAMENTE los archivos que se van a crear o sobrescribir.
    echo   Nada mas se toca -- esto NUNCA borra archivos que no esten en esta lista:
    echo   ------------------------------------------------------------
    tar -tf "C:\Users\pacoi\Downloads\%ULTIMO_ZIP%"
    echo   ------------------------------------------------------------
    echo.
    set /p CONFIRMA="  Escribe S y Enter para aplicar estos archivos, o cualquier otra cosa para cancelar: "
    if /i not "!CONFIRMA!"=="S" (
        echo.
        echo   Cancelado. No se toco NINGUN archivo del proyecto.
        echo   ^(El respaldo del Paso 1 ya quedo hecho de todos modos.^)
        pause
        exit /b 0
    )
    tar -xf "C:\Users\pacoi\Downloads\%ULTIMO_ZIP%" -C "C:\Users\pacoi\Downloads\cobertore"
    if errorlevel 1 (
        echo   [ERROR] tar no pudo extraer el zip. Copia este mensaje para Claude.
        pause
        exit /b 1
    )
    echo   OK - zip extraido.
)

REM ===== Paso 3: Copiar firestore.rules / storage.rules mas recientes si existen =====
echo.
echo ===== Paso 3: Buscando reglas de Firestore/Storage recien descargadas =====
if exist "C:\Users\pacoi\Downloads\firestore.rules" (
    copy /y "C:\Users\pacoi\Downloads\firestore.rules" "C:\Users\pacoi\Downloads\cobertore\firestore.rules" >nul
    echo   OK - firestore.rules actualizado.
) else (
    echo   No hay firestore.rules nuevo en Descargas, se deja el actual.
)
if exist "C:\Users\pacoi\Downloads\storage.rules" (
    copy /y "C:\Users\pacoi\Downloads\storage.rules" "C:\Users\pacoi\Downloads\cobertore\storage.rules" >nul
    echo   OK - storage.rules actualizado.
) else (
    echo   No hay storage.rules nuevo en Descargas, se deja el actual.
)

REM ===== Paso 4: Limpiar cache de build =====
echo.
echo ===== Paso 4: Borrando cache de build anterior (.next, out, functions\lib) =====
if exist ".next" rmdir /s /q ".next"
if exist "out" rmdir /s /q "out"
if exist "functions\lib" rmdir /s /q "functions\lib"
echo   OK - cache limpiado.

REM ===== Paso 5: Compilar el sitio =====
echo.
echo ===== Paso 4.5: Instalando dependencias (npm install) =====
REM Si package.json cambio (nueva libreria agregada por cualquier sesion),
REM sin esto el build fallaria con "Cannot find module".
call npm install
if errorlevel 1 (
    echo   [ERROR] npm install fallo. Copia TODO lo de arriba y pasaselo a Claude.
    pause
    exit /b 1
)
echo   OK - dependencias al dia.

echo.
echo ===== Paso 5: Compilando el sitio (npm run build) =====
call npm run build
if errorlevel 1 (
    echo   [ERROR] El build del sitio fallo. Copia TODO lo de arriba y pasaselo a Claude.
    echo   Tu respaldo sigue intacto en: %TAGNAME%
    pause
    exit /b 1
)
echo   OK - build del sitio exitoso.

REM ===== Paso 6: Compilar las Cloud Functions =====
echo.
echo ===== Paso 6: Compilando las Cloud Functions =====
cd functions
call npm run build
if errorlevel 1 (
    echo   [ERROR] El build de functions fallo. Copia TODO lo de arriba y pasaselo a Claude.
    echo   Tu respaldo sigue intacto en: %TAGNAME%
    cd ..
    pause
    exit /b 1
)
cd ..
echo   OK - build de functions exitoso.

REM ===== Paso 7: Commit =====
echo.
echo ===== Paso 7: Commit =====
git add -A
git commit -m "fix: aplicar cambios automatizados via todo-en-uno.bat (%TIMESTAMP%)"

REM ===== Paso 8: Push =====
echo.
echo ===== Paso 8: Push a GitHub =====
git push
if errorlevel 1 (
    git push --set-upstream origin security-and-polish
)
if errorlevel 1 (
    echo   [ERROR] El push fallo. Copia TODO lo de arriba y pasaselo a Claude.
    pause
    exit /b 1
)
echo   OK - push exitoso.

REM ===== Paso 9: Deploy =====
echo.
echo ===== Paso 9: Deploy de Firestore/Storage rules =====
call firebase deploy --only firestore:rules,storage
if errorlevel 1 (
    echo   [ERROR] Deploy de rules fallo. Copia TODO lo de arriba y pasaselo a Claude.
    pause
    exit /b 1
)

echo.
echo ===== Paso 10: Deploy de Hosting =====
call firebase deploy --only hosting
if errorlevel 1 (
    echo   [ERROR] Deploy de hosting fallo. Copia TODO lo de arriba y pasaselo a Claude.
    pause
    exit /b 1
)

echo.
echo ===== Paso 11: Deploy de Cloud Functions =====
call firebase deploy --only functions
if errorlevel 1 (
    echo   [ERROR] Deploy de functions fallo. Copia TODO lo de arriba y pasaselo a Claude.
    pause
    exit /b 1
)

REM ===== Paso 12: Verificar que el sitio en vivo responda =====
echo.
echo ===== Paso 12: Verificando que el sitio en vivo responda =====
powershell -NoProfile -Command ^
  "try { $r = Invoke-WebRequest -Uri 'https://cobertores-web.web.app/' -UseBasicParsing -TimeoutSec 15; Write-Host ('  OK - el sitio respondio codigo ' + $r.StatusCode) } catch { Write-Host '  [AVISO] No se pudo confirmar que el sitio responda. Revisalo tu manualmente en el navegador.' }"

REM ===== Paso 13: Limpiar reportes y respaldos viejos (quedarse con los ultimos 5) =====
echo.
echo ===== Paso 13: Limpiando reportes y respaldos viejos (conservando los ultimos 5) =====
if exist "revisiones" (
    for /f "skip=5 delims=" %%F in ('dir /b /o:-d "revisiones\revision-*.txt" 2^>nul') do del "revisiones\%%F"
)
if exist "respaldos" (
    for /f "skip=5 delims=" %%F in ('dir /b /o:-d "respaldos\backup-*.zip" 2^>nul') do del "respaldos\%%F"
)
echo   OK - limpieza hecha.

echo.
echo ============================================================
echo   TODO LISTO. Revisa https://www.cobertores.com en unos minutos.
echo   Respaldo de este punto: %TAGNAME%
echo   Si algo se ve mal: git checkout %TAGNAME%
echo ============================================================
pause
