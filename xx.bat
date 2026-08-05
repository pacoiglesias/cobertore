
@echo off
setlocal
 
REM ============================================
REM  Comprime el proyecto "cobertore" en un .zip
REM  excluyendo carpetas pesadas/innecesarias
REM ============================================
 
set "ORIGEN=C:\Users\pacoi\Downloads\cobertore"
set "DESTINO=C:\Users\pacoi\Downloads\cobertore_backup.zip"
 
if exist "%DESTINO%" del "%DESTINO%"
 
echo Comprimiendo "%ORIGEN%" ...
echo Esto puede tardar unos segundos, espera...
 
powershell -NoProfile -Command ^
  "$origen = '%ORIGEN%';" ^
  "$destino = '%DESTINO%';" ^
  "$excluir = @('node_modules', '.git', '.next', 'out', '.firebase');" ^
  "$items = Get-ChildItem -Path $origen -Force | Where-Object { $excluir -notcontains $_.Name };" ^
  "Compress-Archive -Path $items.FullName -DestinationPath $destino -CompressionLevel Optimal;"
 
if exist "%DESTINO%" (
    echo.
    echo Listo. Se creo el archivo:
    echo   %DESTINO%
    echo.
    echo Ahora arrastra ese .zip al chat de Claude.
) else (
    echo.
    echo Algo fallo. Revisa que la ruta ORIGEN sea correcta.
)
 
echo.
pause
 