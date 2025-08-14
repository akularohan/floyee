Write-Host "🚀 Starting Flowy - Professional Task Management App" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Clean up any existing processes
Write-Host "🧹 Cleaning up existing processes..." -ForegroundColor Yellow
$ports = @(3000, 3001, 5000, 8000)
foreach ($port in $ports) {
    try {
        $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        foreach ($process in $processes) {
            Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        }
    } catch {
        # Ignore errors
    }
}
Write-Host "✅ Ports cleaned!" -ForegroundColor Green

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    npm install
}

if (!(Test-Path "client/node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location client
    npm install
    Set-Location ..
}

Write-Host "✅ Dependencies ready!" -ForegroundColor Green
Write-Host ""

# Start the servers
Write-Host "🔧 Starting Flowy Backend Server (Port 8000)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Flowy Backend Server' -ForegroundColor Green; npm run server" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "🎨 Starting Flowy Frontend (Port 3000)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Flowy Frontend' -ForegroundColor Blue; cd client; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "🎉 Flowy is starting up!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Blue
Write-Host "⚙️  Backend:  http://localhost:8000" -ForegroundColor Green
Write-Host ""
Write-Host "✨ Features Available:" -ForegroundColor Yellow
Write-Host "   • Modern Kanban Board with Real-time Sync" -ForegroundColor White
Write-Host "   • Team Collaboration & Chat" -ForegroundColor White
Write-Host "   • Task Time Tracking" -ForegroundColor White
Write-Host "   • Professional UI with Tailwind CSS" -ForegroundColor White
Write-Host "   • Responsive Design for All Devices" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Visit http://localhost:3000 to get started!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")