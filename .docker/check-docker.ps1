# Check if Docker Desktop is installed
$uninstall = Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*'
$docker = $uninstall | Where-Object { $_.DisplayName -like '*Docker*' }
if ($docker) {
    Write-Host "INSTALLED: $($docker.DisplayName) at $($docker.InstallLocation)"
} else {
    Write-Host "NOT_INSTALLED"
}

# Check PATH
$dockerExe = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerExe) {
    Write-Host "DOCKER_IN_PATH: $($dockerExe.Source)"
} else {
    Write-Host "NOT_IN_PATH"
}
