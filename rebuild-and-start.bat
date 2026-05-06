@echo off
setlocal
title smart-farm-pwa (build + start)

cd /d "%~dp0"
if not exist "package.json" (
  echo [ERROR] package.json not found.
  exit /b 1
)

echo [%date% %time%] npm run build...
call npm run build
if errorlevel 1 (
  echo [ERROR] Build failed.
  pause
  exit /b 1
)

echo.
echo [%date% %time%] npm start...
call npm start

echo.
echo [%date% %time%] npm start exited with code %ERRORLEVEL%.
pause
exit /b %ERRORLEVEL%
