@echo off
title Landing Page Local Server
echo ===================================================
echo   Starting Local Server at http://localhost:3000
echo ===================================================
echo.
echo Opening browser...
start http://localhost:3000
echo.
echo Press Ctrl+C in this window to stop the server anytime.
python -m http.server 3000
