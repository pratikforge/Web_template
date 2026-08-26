@echo off
title PocketBase Backend Server
echo ===================================================
echo   Starting PocketBase Backend for Hackathon Demo
echo ===================================================
echo.
echo REST API:     http://127.0.0.1:8090/api/
echo Admin UI:     http://127.0.0.1:8090/_/
echo Local DB:     backend/pb_data/data.db
echo.
echo Press Ctrl+C to stop the server.
echo.

cd /d "%~dp0"
pocketbase.exe serve --http="127.0.0.1:8090"
