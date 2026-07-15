$installer = "C:\Users\anggi\Downloads\docker-installer.exe"

Write-Host ">>> Memasang Docker Desktop..."
Write-Host ">>> Installer: $installer"
Write-Host ">>> UAC prompt akan muncul - klik Yes"
Write-Host ">>> Installer GUI akan muncul - klik Install/OK"

Start-Process -FilePath $installer -Verb RunAs -Wait

Write-Host ">>> Installer selesai"
