@echo off
setlocal enabledelayedexpansion
echo Creating scheduled task to install WSL...
schtasks /Create /SC ONCE /TN "InstallWSL-Docker" /TR "'powershell.exe -ExecutionPolicy Bypass -Command ""dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart /quiet; dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart /quiet; wsl --set-default-version 2""'" /ST 23:59 /RL HIGHEST /F
echo.
echo Done. SCHTASKS exit code: %ERRORLEVEL%
