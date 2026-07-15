Write-Host "=================================="
Write-Host " Upgrade WSL via Task Scheduler "
Write-Host "=================================="

$taskName = "UpgradeWSL"
$scriptBlock = {
    winget install --id Microsoft.WSL --accept-source-agreements --accept-package-agreements --scope machine 2>&1 | Out-File C:\WSL_UPGRADE_LOG.TXT -Encoding ASCII
}
$scriptPath = "$env:TEMP\_upgrade_wsl.ps1"
$scriptBlock.ToString() | Out-File -FilePath $scriptPath -Encoding ASCII -Force

# Schedule as SYSTEM
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -File `"$scriptPath`" -WindowStyle Hidden"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddSeconds(15)
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -Hidden
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -User "SYSTEM" -RunLevel Highest -Force | Out-Null
Start-ScheduledTask -TaskName $taskName

Write-Host ">>> Task '$taskName' dijadwalkan dan dijalankan."
Write-Host ">>> Tunggu 2-3 menit, lalu cek log:"
Write-Host "    type C:\WSL_UPGRADE_LOG.TXT"
