@echo off
title StaffSync HRM - Production Mode
color 0a

echo ========================================================
echo       StaffSync - Production Build and Server
echo ========================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    pause
    exit /b 1
)

:: Ensure server/.env exists
if not exist "server\.env" (
    if exist "server\.env.example" (
        copy "server\.env.example" "server\.env" >nul
        echo [INFO] Created server\.env
    )
)

:: Install dependencies if missing
if not exist "server\node_modules" (
    echo [INFO] Installing server dependencies...
    call npm.cmd install --prefix server
)
if not exist "client\node_modules" (
    echo [INFO] Installing client dependencies...
    call npm.cmd install --prefix client
)

echo.
echo [INFO] Building production frontend with Vite...
call npm.cmd run build --prefix client

echo.
echo ========================================================
echo [INFO] Starting production server on port 5000...
echo [INFO] Opening http://localhost:5000
echo ========================================================
echo.

start "" powershell -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:5000'"

set NODE_ENV=production
node server/src/index.js

pause
