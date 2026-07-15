Write-Host "=== Cek State Fitur WSL ==="
dism /online /get-featureinfo /featurename:Microsoft-Windows-Subsystem-Linux
Write-Host ""
Write-Host "=== Cek State VMP ==="
dism /online /get-featureinfo /featurename:VirtualMachinePlatform
Write-Host ""

Write-Host "=== Cek Package ==="
dism /online /get-packages /format:table | findstr -i "WSL wsl linux subsystem"
Write-Host ""

Write-Host "=== Coba enable ulang ==="
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart /quiet
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart /quiet

Write-Host ""
Write-Host "=== Cek WSL setelah enable ==="
wsl.exe --status 2>&1
Write-Host ""
Write-Host "=== WSL Set Default 2 ==="
wsl.exe --set-default-version 2 2>&1
