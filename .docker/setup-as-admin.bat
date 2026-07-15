@echo off
title Setup Docker untuk ACT-LEPKOM-V2
echo ========================================
echo   SETUP DOCKER + WSL 2 - ACT LEPKOM V2
echo ========================================
echo.
echo Script ini akan:
echo  1. Install WSL (Windows Subsystem for Linux)
echo  2. Install Ubuntu via WSL
echo  3. Siapkan Docker Desktop
echo.
echo JALANKAN SEBAGAI ADMINISTRATOR!
echo (Klik kanan - Run as Administrator)
echo.
pause
echo.
echo === 1. Enable WSL features ===
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
echo.
echo === 2. Set WSL 2 as default ===
wsl --set-default-version 2
echo.
echo === 3. Install Ubuntu ===
wsl --install -d Ubuntu
echo.
echo === 4. Start Docker Desktop ===
if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo Docker Desktop started!
) else (
    echo Docker Desktop belum terinstall.
    echo Download dari https://docs.docker.com/desktop/setup/install/windows-install/
)
echo.
echo === SELESAI! ===
echo Setelah semua selesai, buka terminal baru dan jalankan:
echo   cd C:\laragon\www\act-lepkom-v2
echo   docker compose up -d
echo.
echo Lalu buka: http://localhost:8080
echo phpMyAdmin: http://localhost:8081
pause
