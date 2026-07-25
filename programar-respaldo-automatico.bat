@echo off
REM ============================================================
REM  PROGRAMAR-RESPALDO-AUTOMATICO.BAT
REM  Corre esto UNA SOLA VEZ. Registra una tarea en el Programador
REM  de Tareas de Windows que corre respaldo-cobertore.bat todos los
REM  dias a las 8:00pm, sin que tengas que acordarte de nada.
REM
REM  Para revisarla despues: abre "Programador de tareas" en Windows
REM  y busca "RespaldoCobertoreDiario".
REM  Para quitarla: schtasks /delete /tn "RespaldoCobertoreDiario" /f
REM ============================================================

schtasks /create /tn "RespaldoCobertoreDiario" /tr "C:\Users\pacoi\Downloads\cobertore\respaldo-cobertore.bat" /sc daily /st 20:00 /f

if errorlevel 1 (
    echo.
    echo [ERROR] No se pudo crear la tarea. Copia este mensaje para Claude.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo   LISTO. A partir de hoy, todos los dias a las 8:00pm se va
echo   a crear un respaldo automatico (tag de git + zip), sin que
echo   tengas que correr nada tu.
echo.
echo   Nota: tu computadora tiene que estar prendida a esa hora
echo   para que corra. Si un dia no lo esta, simplemente no se
echo   crea el respaldo de ese dia -- no rompe nada.
echo ============================================================
pause
