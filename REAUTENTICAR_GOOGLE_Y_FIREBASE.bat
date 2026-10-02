@echo off
chcp 65001 >nul
title Reautenticación Google Cloud & Firebase - Mano Fil Cobertores
color 0B
echo =========================================================================
echo    REAUTENTICACIÓN DE CREDENCIALES GOOGLE CLOUD Y FIREBASE
echo    Mano Fil S.A. - Cobertores.com
echo =========================================================================
echo.
echo Este script resuelve el error:
echo "invalid_grant: reauth related error (invalid_rapt)"
echo.
echo Se abrirá tu navegador para confirmar el acceso con tu cuenta Google:
echo   --^> paco@cobertores.com o la cuenta administradora.
echo.
pause

echo.
echo [1/3] Renovando Application Default Credentials (ADC) de Google Cloud...
call "C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth application-default login
if %errorlevel% neq 0 (
    echo [AVISO] Intentando con gcloud directo en PATH...
    gcloud auth application-default login
)

echo.
echo [2/3] Renovando sesión principal de Google Cloud...
call "C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth login
if %errorlevel% neq 0 (
    gcloud auth login
)

echo.
echo [3/3] Renovando sesión de Firebase CLI...
call npx -y firebase-tools login --reauth

echo.
echo Seleccionando proyecto activo en Firebase...
call npx -y firebase-tools use cobertores-web

echo.
echo =========================================================================
echo    ¡REAUTENTICACIÓN COMPLETADA EXITOSAMENTE!
echo    Google Cloud ADC, Firestore y Firebase CLI están listos.
echo =========================================================================
echo.
pause
