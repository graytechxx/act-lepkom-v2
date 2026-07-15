$msi = "C:\Users\anggi\Downloads\wsl_update_x64.msi"
Write-Host ">>> Installing WSL Kernel Update..."
$p = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", "`"$msi`"", "/quiet", "/norestart" -Verb RunAs -Wait -PassThru
Write-Host ">>> Exit code: $($p.ExitCode)"

# Check
$k = "$env:SystemRoot\System32\lxss\tools\kernel"
if (Test-Path $k) {
    Write-Host "Kernel: OK ($k)"
} else {
    Write-Host "Kernel: NOT FOUND"
}
