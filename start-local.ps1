# Smart Emergency Grid — local startup (no Docker)
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

Write-Host "==> Building backend..." -ForegroundColor Cyan
Set-Location "$Root\backend"
mvn -q clean package -DskipTests

Write-Host "==> Installing Python service dependencies..." -ForegroundColor Cyan
foreach ($svc in @("ai-severity-service", "route-optimization-service", "hospital-recommendation-service")) {
    Set-Location "$Root\$svc"
    python -m pip install -q -r requirements.txt
}

Write-Host "==> Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location "$Root\frontend"
if (-not (Test-Path "node_modules")) { npm install }

if (Test-Path "$Root\.env") {
    Copy-Item "$Root\.env" "$Root\frontend\.env.local" -Force
}

$env:SPRING_PROFILES_ACTIVE = "local"

function Start-ServiceWindow {
    param([string]$Title, [string]$WorkDir, [string]$Command)
    Start-Process powershell -ArgumentList @(
        "-NoExit", "-Command",
        "`$Host.UI.RawUI.WindowTitle = '$Title'; Set-Location '$WorkDir'; $Command"
    )
}

Write-Host "==> Starting services in new windows..." -ForegroundColor Green

Start-ServiceWindow "SEG severity-ai" "$Root\ai-severity-service" `
    "python -m uvicorn app:app --host 0.0.0.0 --port 8001"

Start-ServiceWindow "SEG route-opt" "$Root\route-optimization-service" `
    "python -m uvicorn app:app --host 0.0.0.0 --port 8002"

Start-ServiceWindow "SEG hospital-rec" "$Root\hospital-recommendation-service" `
    "python -m uvicorn app:app --host 0.0.0.0 --port 8003"

Start-ServiceWindow "SEG emergency" "$Root\backend" `
    "`$env:SPRING_PROFILES_ACTIVE='local'; `$env:SERVER_PORT='8081'; mvn -q -pl emergency-service spring-boot:run"

Start-Sleep -Seconds 12

Start-ServiceWindow "SEG ambulance" "$Root\backend" `
    "`$env:SPRING_PROFILES_ACTIVE='local'; `$env:SERVER_PORT='8082'; mvn -q -pl ambulance-service spring-boot:run"

Start-ServiceWindow "SEG hospital" "$Root\backend" `
    "`$env:SPRING_PROFILES_ACTIVE='local'; `$env:SERVER_PORT='8083'; mvn -q -pl hospital-service spring-boot:run"

Start-ServiceWindow "SEG traffic" "$Root\backend" `
    "`$env:SPRING_PROFILES_ACTIVE='local'; `$env:SERVER_PORT='8084'; mvn -q -pl traffic-service spring-boot:run"

Start-Sleep -Seconds 5

Start-ServiceWindow "SEG frontend" "$Root\frontend" "npm run dev"

Write-Host ""
Write-Host "All services starting. Open:" -ForegroundColor Green
Write-Host "  Citizen App:        http://localhost:3000/sos"
Write-Host "  Hospital Dashboard: http://localhost:3000/hospital-dashboard"
Write-Host "  Command Center:     http://localhost:3000/command-center"
Write-Host ""
Write-Host "Uses embedded H2 database at %USERPROFILE%\.smart-emergency-grid\segdb (no PostgreSQL/Docker required)."
