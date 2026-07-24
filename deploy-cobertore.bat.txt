@echo off
setlocal enabledelayedexpansion
cd /d C:\Users\pacoi\Downloads\cobertore

echo.
echo ===== Paso 1: Quitando carpeta $staging (el error del build anterior) =====
if exist "$staging" (
    git rm -r --cached "$staging" >nul 2>&1
    rmdir /s /q "$staging"
    echo   OK - $staging eliminada.
) else (
    echo   OK - no existe $staging, nada que quitar.
)

echo.
echo ===== Paso 2: Verificando que tus archivos reales tengan los cambios =====
findstr /C:"og-image" src\app\layout.tsx >nul
if errorlevel 1 (
    echo   [ERROR] No se encontro "og-image" en src\app\layout.tsx.
    echo   Esto significa que los archivos reales podrian no tener los cambios del zip.
    echo   DETENTE AQUI y copia este mensaje para Claude.
    pause
    exit /b 1
)
findstr /C:"Trayectoria" src\components\landing\AuthorityRibbon.tsx >nul
if errorlevel 1 (
    echo   [ERROR] No se encontro "Trayectoria" en AuthorityRibbon.tsx.
    echo   DETENTE AQUI y copia este mensaje para Claude.
    pause
    exit /b 1
)
echo   OK - los archivos reales ya tienen los cambios.

echo.
echo ===== Paso 3: Compilando el sitio (npm run build) =====
call npm run build
if errorlevel 1 (
    echo   [ERROR] El build del sitio fallo. Copia TODO lo de arriba y pasaselo a Claude.
    pause
    exit /b 1
)
echo   OK - build del sitio exitoso.

echo.
echo ===== Paso 4: Compilando las Cloud Functions =====
cd functions
call npm run build
if errorlevel 1 (
    echo   [ERROR] El build de functions fallo. Copia TODO lo de arriba y pasaselo a Claude.
    cd ..
    pause
    exit /b 1
)
cd ..
echo   OK - build de functions exitoso.

echo.
echo ===== Paso 5: Commit =====
git add -A
git commit -m "fix: quitar carpeta staging duplicada por error"

echo.
echo ===== Paso 6: Push a GitHub =====
git push --set-upstream origin security-and-polish
if errorlevel 1 (
    echo   [ERROR] El push fallo. Copia TODO lo de arriba y pasaselo a Claude.
    pause
    exit /b 1
)
echo   OK - push exitoso.

echo.
echo ===== Paso 7: Deploy de Firestore y Storage rules =====
call firebase deploy --only firestore:rules,storage
if errorlevel 1 (
    echo   [ERROR] El deploy de rules fallo. Copia TODO lo de arriba y pasaselo a Claude.
    pause
    exit /b 1
)

echo.
echo ===== Paso 8: Deploy de Cloud Functions =====
call firebase deploy --only functions
if errorlevel 1 (
    echo   [ERROR] El deploy de functions fallo. Copia TODO lo de arriba y pasaselo a Claude.
    pause
    exit /b 1
)

echo.
echo ===== Paso 9: Deploy de Hosting (el sitio publico) =====
call firebase deploy --only hosting
if errorlevel 1 (
    echo   [ERROR] El deploy de hosting fallo. Copia TODO lo de arriba y pasaselo a Claude.
    pause
    exit /b 1
)

echo.
echo ===== TODO LISTO =====
echo El sitio deberia estar desplegado. Revisa https://www.cobertores.com en unos minutos.
pause