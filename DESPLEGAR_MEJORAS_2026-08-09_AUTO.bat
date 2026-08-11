@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
set LOGFILE=%~dp0DEPLOY_LOG_2026-08-09.txt

echo ============================================================ > "%LOGFILE%"
echo  DEPLOY AUTOMATICO - cobertores.com - 2026-08-09 >> "%LOGFILE%"
echo  Inicio: %date% %time% >> "%LOGFILE%"
echo ============================================================ >> "%LOGFILE%"

echo. >> "%LOGFILE%"
echo --- Paso 1/2: git push --- >> "%LOGFILE%"
git push >> "%LOGFILE%" 2>&1
echo git push termino con codigo %errorlevel% >> "%LOGFILE%"

echo. >> "%LOGFILE%"
echo --- Paso 2/2: npm run deploy:hosting (test:e2e + build + firebase deploy) --- >> "%LOGFILE%"
call npm run deploy:hosting >> "%LOGFILE%" 2>&1
set DEPLOY_EXIT=%errorlevel%
echo npm run deploy:hosting termino con codigo %DEPLOY_EXIT% >> "%LOGFILE%"

echo. >> "%LOGFILE%"
echo Fin: %date% %time% >> "%LOGFILE%"

if %DEPLOY_EXIT% EQU 0 (
  echo. >> "%LOGFILE%"
  echo RESULTADO: EXITO. Publicado en https://cobertores.com >> "%LOGFILE%"
) else (
  echo. >> "%LOGFILE%"
  echo RESULTADO: FALLO. Revisa el log de arriba. Si menciona "firebase login" o "reauth", corre en una terminal: firebase login --reauth  y luego vuelve a ejecutar este archivo. >> "%LOGFILE%"
)

exit /b %DEPLOY_EXIT%
