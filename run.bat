@echo off
title StaffSync HRM - Development Server
color 0b

echo ========================================================
echo       StaffSync - Human Resource Management Solution
echo ========================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js (v18+) from https://nodejs.org
    pause
    exit /b 1
)

:: Ensure server/.env exists
if not exist "server\.env" (
    if exist "server\.env.example" (
        copy "server\.env.example" "server\.env" >nul
        echo [INFO] Created server\.env from .env.example
    )
)

:: Ensure client/.env exists
if not exist "client\.env" (
    echo VITE_API_URL=/api > "client\.env"
    echo [INFO] Created client\.env
)

:: Install server dependencies if missing
if not exist "server\node_modules" (
    echo [INFO] Installing server dependencies...
    call npm.cmd install --prefix server
)

:: Install client dependencies if missing
if not exist "client\node_modules" (
    echo [INFO] Installing client dependencies...
    call npm.cmd install --prefix client
)

echo.
echo [INFO] Launching StaffSync Development Environment...
echo [INFO] Backend API:  http://localhost:5000/api
echo [INFO] Frontend App: http://localhost:5173
echo.
echo Press Ctrl+C in this window anytime to stop the servers.
echo ========================================================
echo.

:: Open browser after 3 seconds
start "" powershell -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:5173'"

:: Run dev runner
node dev.js

pause
