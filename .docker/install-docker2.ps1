$installer = "C:\Users\anggi\Downloads\docker-installer.exe"

Write-Host ">>> Memasang Docker Desktop (verbose)..."
Write-Host ">>> Installer: $installer"

# Try backend=hyper-v as alternative
# Start-Process -FilePath $installer -ArgumentList @("--accept-license", "--backend=hyper-v") -Verb RunAs -Wait -NoNewWindow

# Try without flags
Start-Process -FilePath $installer -Verb RunAs -Wait -NoNewWindow

Write-Host ">>> Installer selesai"
