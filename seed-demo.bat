@echo off
title StaffSync - Seed Demo Database
color 0e

echo ========================================================
echo       StaffSync - Seeding Demo Accounts
echo ========================================================
echo.

node server/src/seed.js

echo.
pause
