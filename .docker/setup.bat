@echo off
echo ========================================
echo Install WSL + Docker Desktop untuk Laravel
echo ========================================
echo.
echo 1. Install WSL dan Virtual Machine Platform
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

echo.
echo 2. Set WSL 2 sebagai default
wsl --set-default-version 2

echo.
echo 3. Install Ubuntu via WSL
echo (Ini akan download Ubuntu - butuh internet)
wsl --install -d Ubuntu

echo.
echo 4. Restart Docker Desktop
echo "C:\Program Files\Docker\Docker\Docker Desktop.exe" --restart

echo.
echo ========================================
echo Selesai! Restart komputer jika diminta.
echo Lalu jalankan: docker compose up -d
echo ========================================
pause
