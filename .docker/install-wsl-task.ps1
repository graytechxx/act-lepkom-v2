$taskName = "WSL-Install-Temp"

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -Command `"dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart /quiet; dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart /quiet; wsl --set-default-version 2; wsl --install -d Ubuntu; Write-Host 'SELESAI - Restart Docker Desktop sekarang'`" -WindowStyle Normal

$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1)

$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -User "SYSTEM" -RunLevel Highest -Force

Write-Host ">>> Task '$taskName' telah dijadwalkan. Akan jalan dalam 1 menit sebagai SYSTEM."
Write-Host ">>> Ini akan menginstall WSL + Ubuntu tanpa perlu logon."
Write-Host ">>> Setelah task selesai, restart Docker Desktop."
Start-Sleep -Seconds 5
Start-ScheduledTask -TaskName $taskName
Write-Host ">>> Task dijalankan."
