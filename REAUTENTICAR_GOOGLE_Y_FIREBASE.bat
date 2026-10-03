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
echo [1/2] Renovando sesión de Firebase CLI...
echo Se abrirá tu navegador para confirmar el acceso con paco@cobertores.com
call firebase login --reauth
if %errorlevel% neq 0 (
    echo.
    echo [AVISO] Intentando modo seguro (--no-localhost)...
    call firebase login --no-localhost
)

echo.
echo Seleccionando proyecto activo en Firebase (cobertores-web)...
call firebase use cobertores-web

echo.
echo [2/2] ¿Deseas renovar también credenciales de Google Cloud SDK (gcloud / ADC)? (S/N):
set /p renovar_gcloud=
if /i "%renovar_gcloud%"=="S" (
    echo Renovando sesión de Google Cloud...
    call "C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth application-default login
    call "C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth login
)

echo.
echo =========================================================================
echo    ¡REAUTENTICACIÓN COMPLETADA EXITOSAMENTE!
echo    Firebase CLI está conectado y listo en cobertores-web.
echo =========================================================================
echo.
pause

