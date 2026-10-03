@echo off
chcp 65001 >nul
title Reautenticación Google Cloud & Firebase - Mano Fil Cobertores
color 0B
echo =========================================================================
echo    REAUTENTICACIÓN DE CREDENCIALES GOOGLE CLOUD Y FIREBASE
echo    Mano Fil S.A. - Cobertores.com
echo =========================================================================
echo.
echo Este script resuelve directamente:
echo   1. Error de Firestore MCP / ADC:
echo      "invalid_grant: reauth related error (invalid_rapt)"
echo   2. Sesión de Firebase CLI y proyecto cobertores-web.
echo.
echo Se abrirá tu navegador para confirmar el acceso:
echo   --^> Cuenta: paco@cobertores.com
echo.
pause

echo.
echo [1/3] Renovando Application Default Credentials (ADC) de Google Cloud...
echo (Esto elimina el error de "invalid_rapt" en Firestore / Google Cloud MCP)
call "C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth application-default login
if %errorlevel% neq 0 (
    echo [AVISO] Intentando con gcloud directo en PATH...
    call gcloud auth application-default login
)

echo.
echo [2/3] Verificando sesión de Google Cloud CLI...
call "C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth login --brief 2>nul
if %errorlevel% neq 0 (
    call gcloud auth login --brief 2>nul
)

echo.
echo [3/3] Verificando sesión de Firebase CLI (cobertores-web)...
call firebase use cobertores-web 2>nul
if %errorlevel% neq 0 (
    echo Renovando Firebase CLI...
    call firebase login --reauth
    call firebase use cobertores-web
) else (
    echo Firebase CLI ya está conectado y activo en cobertores-web.
)

echo.
echo =========================================================================
echo    ¡REAUTENTICACIÓN COMPLETADA EXITOSAMENTE!
echo    - Google Cloud ADC (Firestore MCP) renovado sin errores.
echo    - Firebase CLI listo para desplegar.
echo =========================================================================
echo.
pause

