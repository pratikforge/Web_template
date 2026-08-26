@echo off
title Frontend Dev Server
echo ===================================================
echo   Starting Frontend Dev Server (Vite + React)
echo ===================================================
echo.
echo URL: http://localhost:5173/
echo.

cd /d "%~dp0frontend"
npm run dev
