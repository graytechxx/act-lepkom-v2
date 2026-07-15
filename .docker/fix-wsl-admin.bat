@echo off
cd /d "%~dp0"
title FIX WSL UNTUK DOCKER - JALANKAN SEBAGAI ADMINISTRATOR

:: =========== MAIN SCRIPT ===========
>nul 2>&1 net session
if %errorLevel% neq 0 (
    echo.
    echo ================================================
    echo   HARUS JALANKAN SEBAGAI ADMINISTRATOR!
    echo ================================================
    echo   Klik kanan - Run as Administrator
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   FIX WSL UNTUK DOCKER - ACT LEPKOM V2
echo ================================================
echo.

echo [1/4] Enable Windows Subsystem for Linux...
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

echo.
echo [2/4] Enable Virtual Machine Platform...
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

echo.
echo [3/4] Set WSL 2 sebagai default...
wsl --set-default-version 2

echo.
echo [4/4] Install Ubuntu via WSL...
echo (Ini akan download Ubuntu ~500MB - butuh internet)
wsl --install -d Ubuntu

echo.
echo ================================================
echo   SELESAI!
echo ================================================
echo   Kalau ada yang minta restart, RESTART dulu.
echo   Abis restart, buka Docker Desktop.
echo.
echo   Lalu: docker compose up -d
echo.
pause
