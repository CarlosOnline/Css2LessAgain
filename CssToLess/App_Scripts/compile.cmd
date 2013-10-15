@if "%_echo%"=="" echo off
setlocal ENABLEDELAYEDEXPANSION
cls
echo %0 %*
echo tsc.exe ...
echo.

pushd %~dp0
set TsFiles=

for /R %~dp0\..\Scripts %%X in (*.ts) do (
    echo %%~fX
    set TsFiles=!TsFiles! %%~fX
)

for %%X in (*.ts) do (
    echo %%~fX
    set TsFile%%~fXs=!TsFiles! %%~fX
)

rem     --comments ^
"C:\Program Files (x86)\Microsoft SDKs\TypeScript\tsc.exe"  ^
     --module AMD ^
     --sourcemap ^
     --target ES3 ^
     !TsFiles!

popd

for /R %~dp0\res %%X in (*.ts) do (
    @echo %%X

    "C:\Program Files (x86)\Microsoft SDKs\TypeScript\tsc.exe"  ^
         --module AMD ^
         --sourcemap ^
         --target ES3 ^
        %%~fX
)
