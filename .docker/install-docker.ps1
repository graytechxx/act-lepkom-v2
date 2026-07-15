$installer = "C:\Users\anggi\Downloads\docker-installer.exe"
$args = "--accept-license", "--backend=wsl-2", "--quiet"

Write-Host ">>> Memasang Docker Desktop..."
Write-Host ">>> Installer: $installer"
Write-Host ">>> Args: $args"
Write-Host ">>> UAC prompt akan muncul - klik Yes / Ya"

Start-Process -FilePath $installer -ArgumentList $args -Verb RunAs -Wait

Write-Host ">>> Selesai. Exit code: $LASTEXITCODE"
