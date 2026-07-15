$scriptPath = "C:\laragon\www\act-lepkom-v2\.docker\enable-wsl2.ps1"
Start-Process -FilePath "powershell.exe" -ArgumentList @("-ExecutionPolicy", "Bypass", "-File", $scriptPath) -Verb RunAs -Wait
