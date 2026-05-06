@echo off
setlocal
title smart-farm-pwa (next start)

cd /d "%~dp0"
if not exist "package.json" (
  echo [ERROR] package.json not found. Move this .bat next to package.json.
  exit /b 1
)

echo [%date% %time%] Starting Next.js production server...
echo Working dir: %CD%
echo.

npm start

echo.
echo [%date% %time%] npm start exited with code %ERRORLEVEL%.
exit /b %ERRORLEVEL%
