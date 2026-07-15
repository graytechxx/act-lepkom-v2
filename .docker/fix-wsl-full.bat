@echo off
cd /d "%~dp0"
>nul 2>&1 net session
if %errorLevel% neq 0 (
    echo Hanya admin yang bisa jalan.
    echo Klik kanan - Run as Administrator
    pause
    exit /b 1
)

echo ========================
echo FIX WSL LENGKAP
echo ========================
echo.

:: 1. Cek state feature
echo --- Cek WSL Feature State ---
dism /online /get-featureinfo /featurename:Microsoft-Windows-Subsystem-Linux | findstr /i "State"
dism /online /get-featureinfo /featurename:VirtualMachinePlatform | findstr /i "State"

:: 2. Re-enable (safe)
echo.
echo --- Enable ulang ---
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart /quiet
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart /quiet

:: 3. Register WSL kernel (if MSI exists)
echo.
echo --- Install WSL Kernel ---
if exist "C:\Users\anggi\Downloads\wsl_update_x64.msi" (
    msiexec /i "C:\Users\anggi\Downloads\wsl_update_x64.msi" /quiet /norestart
)

:: 4. Coba set default WSL2
echo.
echo --- Set WSL 2 ---
wsl --set-default-version 2

:: 5. Cek hasil
echo.
echo --- Status WSL ---
wsl --status
wsl -l -v

echo.
echo ========================
echo SELESAI
echo Coba: wsl --install -d Ubuntu
echo ========================
pause
