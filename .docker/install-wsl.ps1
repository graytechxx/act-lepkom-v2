Write-Host ">>> Menginstall WSL..."
Write-Host ">>> Ini akan install WSL 2 + Ubuntu. Jendela terminal baru akan muncul."
Write-Host ">>> Jika ada UAC/prompts, klik Yes"

# Install WSL
wsl --install

Write-Host ""
Write-Host ">>> WSL install selesai."
wsl --status
