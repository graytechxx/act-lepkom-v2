@echo off
cd /d "%~dp0"
title WSL FIX - DOCKER

:: Check admin
>nul 2>&1 net session
if %errorLevel% neq 0 (
    echo.
    echo ============================================
    echo   TIDAK ADA AKSES ADMIN
    echo ============================================
    echo   Coba gue jalanin ulang sebagai admin...
    echo ============================================
    
    :: Re-run self as admin
    powershell.exe -Command "Start-Process '%~f0' -Verb RunAs"
    
    echo.
    echo   Kalo UAC muncul, klik YES / YA
    echo.
    pause
    exit /b 1
)

echo ============================================
echo  WSL INSTALLER - ADMIN MODE
echo ============================================
echo.

:: Step 1: Cek state
echo [1/5] Enable Windows Subsystem for Linux...
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart /quiet

echo [2/5] Enable Virtual Machine Platform...
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart /quiet

echo [3/5] Install WSL2 Kernel Update...
if exist "C:\Users\anggi\Downloads\wsl_update_x64.msi" (
    msiexec /i "C:\Users\anggi\Downloads\wsl_update_x64.msi" /quiet /norestart
)

echo [4/5] Set WSL2 default...
wsl --set-default-version 2

echo [5/5] Install Ubuntu...
wsl --install -d Ubuntu

echo.
echo ============================================
echo  SELESAI! Status:
echo ============================================
wsl --status
echo.
echo  Restart PC kalo diminta.
echo  Abis restart, buka Docker Desktop.
echo ============================================
pause
