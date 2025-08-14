Write-Host "Starting Flowy Application..." -ForegroundColor Green
Write-Host ""

Write-Host "Cleaning up ports..." -ForegroundColor Yellow
# Kill processes on common ports
$ports = @(3000, 3001, 5000, 8000)
foreach ($port in $ports) {
    $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    foreach ($process in $processes) {
        try {
            Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        } catch {
            # Ignore errors
        }
    }
}

Write-Host "Ports cleaned!" -ForegroundColor Green
Start-Sleep -Seconds 2

Write-Host "Starting Backend Server on port 8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run server" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "Starting Frontend on port 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "Trellis is starting..." -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor Blue
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Blue
Write-Host ""
Write-Host "Wait for both servers to fully start, then visit http://localhost:3000" -ForegroundColor Yellow
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")