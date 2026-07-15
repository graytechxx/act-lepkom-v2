Write-Host ">>> Enable WSL features (requires admin)..."
try {
    # Try to enable WSL features
    $result1 = dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart /quiet
    Write-Host "WSL feature: $($result1[-1])"
    
    $result2 = dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart /quiet
    Write-Host "VMP feature: $($result2[-1])"
    
    Write-Host ""
    Write-Host ">>> Features enabled. A reboot may be required."
    Write-Host ">>> Setelah reboot, jalankan: wsl --set-default-version 2"
    Write-Host ">>> Lalu install Ubuntu dari Microsoft Store, atau jalankan: wsl --install -d Ubuntu"
    Write-Host ""
    Write-Host ">>> Kemudian jalankan Docker Desktop"
    
} catch {
    Write-Host "Error: $_"
    Write-Host "Butuh akses admin. Jalankan PowerShell sebagai Administrator, lalu:"
    Write-Host "  dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart"
    Write-Host "  dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart"
    Write-Host "  wsl --set-default-version 2"
    Write-Host "  wsl --install -d Ubuntu"
}
