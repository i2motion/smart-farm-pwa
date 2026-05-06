@echo off
setlocal EnableDelayedExpansion
title smart-farm-pwa + FarmPcMockVcl

cd /d "%~dp0"
if not exist "package.json" (
  echo [ERROR] package.json not found. Move this .bat next to package.json.
  exit /b 1
)

rem Farm PC Mock (API 8080): sibling folder farm-pc-mock-server
set "MOCK_ROOT=%~dp0..\farm-pc-mock-server"
set "MOCK_EXE="

if exist "!MOCK_ROOT!\FarmPcMockVcl.exe" set "MOCK_EXE=!MOCK_ROOT!\FarmPcMockVcl.exe"
if not defined MOCK_EXE if exist "!MOCK_ROOT!\Win32\Release\FarmPcMockVcl.exe" set "MOCK_EXE=!MOCK_ROOT!\Win32\Release\FarmPcMockVcl.exe"
if not defined MOCK_EXE if exist "!MOCK_ROOT!\Win32\Debug\FarmPcMockVcl.exe" set "MOCK_EXE=!MOCK_ROOT!\Win32\Debug\FarmPcMockVcl.exe"
if not defined MOCK_EXE if exist "!MOCK_ROOT!\Win64\Release\FarmPcMockVcl.exe" set "MOCK_EXE=!MOCK_ROOT!\Win64\Release\FarmPcMockVcl.exe"
if not defined MOCK_EXE if exist "!MOCK_ROOT!\Win64\Debug\FarmPcMockVcl.exe" set "MOCK_EXE=!MOCK_ROOT!\Win64\Debug\FarmPcMockVcl.exe"

if defined MOCK_EXE (
  echo [%date% %time%] Starting FarmPcMockVcl: "!MOCK_EXE!"
  start "" "!MOCK_EXE!"
) else (
  echo [WARN] FarmPcMockVcl.exe not found under "!MOCK_ROOT!" — only Next.js will start.
  echo        Build FarmPcMockVcl in Delphi or copy the .exe next to the project.
)

echo.
echo [%date% %time%] Starting Next.js production server...
echo Working dir: %CD%
echo.

npm start

echo.
echo [%date% %time%] npm start exited with code %ERRORLEVEL%.
exit /b %ERRORLEVEL%
