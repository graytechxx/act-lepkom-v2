Write-Host "============================================"
Write-Host "FIX WSL via SCHTASKS (admin bypass)"
Write-Host "============================================"
Write-Host ""

# Create a temp script that will be run as SYSTEM
$tempScript = "$env:TEMP\_fix_wsl.ps1"
@'
Write-Host ">>> Running as SYSTEM..."
Write-Host ">>> Enable WSL features..."
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart /quiet
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart /quiet

Write-Host ">>> Install WSL2 kernel update..."
$msi = "C:\Users\anggi\Downloads\wsl_update_x64.msi"
if (Test-Path $msi) {
    Start-Process msiexec.exe -ArgumentList "/i", "`"$msi`"", "/quiet", "/norestart" -Wait
}

Write-Host ">>> Set WSL2 as default..."
wsl --set-default-version 2

Write-Host ">>> Install Ubuntu..."
wsl --install -d Ubuntu

Write-Host ">>> WSL Status:"
wsl --status
'@ | Out-File -FilePath $tempScript -Encoding ASCII -Force

# Create a scheduled task that runs immediately as SYSTEM
$taskName = "FixWSL-Temp"
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -File `"$tempScript`" -WindowStyle Normal"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddSeconds(10)
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -User "SYSTEM" -RunLevel Highest -Force | Out-Null

Write-Host ">>> Task '$taskName' dibuat sebagai SYSTEM. Akan jalan dalam 10 detik."
Start-ScheduledTask -TaskName $taskName
Write-Host ">>> Task dijalankan. Tunggu ~2-5 menit..."
Write-Host ">>> Cek progress dengan: schtasks /Query /TN $taskName /FO LIST"
Write-Host ""
Write-Host ">>> Setelah task selesai, restart komputer."
Write-Host ">>> Lalu cek: wsl --status"
