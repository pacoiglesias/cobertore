@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
title cobertores.com - Publicar mejoras SEO 2026-08-09
color 0B
cls
echo.
echo  ============================================================
echo    PUBLICAR MEJORAS - cobertores.com (actualizado 08-10)
echo  ============================================================
echo.
echo   Este script NO BORRA NADA. Publica en internet un commit
echo   NUEVO que todavia no esta en produccion:
echo.
echo     7e07c39 - Conecta Cotizaciones con /seguimiento (ya no
echo     hay que crear el pedido a mano), muestra/edita/exporta el
echo     email de cada prospecto en el CRM, y permite editar
echo     productos del catalogo (antes solo se podia subir/borrar).
echo.
echo   [YA PUBLICADO ANTES, no lo vuelve a hacer dos veces]
echo   860e554 (arreglo SEO de Schema.org) y 9b09cf6 ya se
echo   desplegaron con exito el 09/08 -- este script solo sube y
echo   publica lo nuevo (7e07c39) encima de eso.
echo.
echo   Pasos que va a ejecutar, en orden:
echo     1. git push          (sube el commit nuevo a GitHub)
echo     2. npm run deploy:hosting
echo        (corre las pruebas E2E, compila el sitio y lo publica
echo         en Firebase Hosting -- tarda unos minutos, es normal)
echo.
echo   Si "firebase" pide iniciar sesion (login) o el token expiro,
echo   te lo va a pedir aqui mismo -- solo sigue las instrucciones
echo   en pantalla. No cierres esta ventana mientras corre.
echo.
pause

cd /d "%~dp0"

echo.
echo  ------------------------------------------------------------
echo   Paso 1/2: subiendo commits a GitHub...
echo  ------------------------------------------------------------
git push
if errorlevel 1 (
  echo.
  echo   [AVISO] git push fallo. Revisa el mensaje de arriba
  echo   (puede ser que falte iniciar sesion en git, o que haya
  echo   cambios nuevos en GitHub que primero necesites traer con
  echo   "git pull"^). El despliegue de abajo puede seguir de todas
  echo   formas si solo quieres publicar sin subir a GitHub todavia.
  echo.
  pause
)

echo.
echo  ------------------------------------------------------------
echo   Paso 2/2: pruebas + build + publicar en Firebase Hosting...
echo  ------------------------------------------------------------
call npm run deploy:hosting
if errorlevel 1 (
  echo.
  echo   [ERROR] El despliegue no se completo. Revisa el mensaje de
  echo   arriba. Si dice algo de "firebase login" o "reauth", corre:
  echo.
  echo       firebase login --reauth
  echo.
  echo   y vuelve a ejecutar este archivo.
  echo.
  pause
  exit /b 1
)

echo.
echo  ============================================================
echo    LISTO. Cambios publicados en https://cobertores.com
echo  ============================================================
echo.
pause
