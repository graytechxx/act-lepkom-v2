Write-Host ">>> Step 1: Enable WSL optional feature"
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
Write-Host ""

Write-Host ">>> Step 2: Enable Virtual Machine Platform"
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
Write-Host ""

Write-Host ">>> Step 3: Set WSL 2 as default"
wsl --set-default-version 2
Write-Host ""

Write-Host ">>> Step 4: Install WSL update"
wsl --update
Write-Host ""

Write-Host ">>> Selesai. Status WSL:"
wsl --status
