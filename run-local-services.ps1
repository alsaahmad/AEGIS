$ErrorActionPreference = 'Stop'

$root = Join-Path $PSScriptRoot ''
Set-Location $root

Write-Host '==> Building backend...' -ForegroundColor Cyan
Set-Location (Join-Path $root 'backend')
mvn -q clean package -DskipTests

function Start-ServiceProcess($filePath, $argumentList, $workDir) {
    Write-Host "==> Starting $filePath in $workDir" -ForegroundColor Green
    Start-Process -WindowStyle Hidden -FilePath $filePath -ArgumentList $argumentList -WorkingDirectory $workDir
}

Start-ServiceProcess 'python' ('-m','uvicorn','app:app','--host','0.0.0.0','--port','8001') (Join-Path $root 'ai-severity-service')
Start-ServiceProcess 'python' ('-m','uvicorn','app:app','--host','0.0.0.0','--port','8002') (Join-Path $root 'route-optimization-service')
Start-ServiceProcess 'python' ('-m','uvicorn','app:app','--host','0.0.0.0','--port','8003') (Join-Path $root 'hospital-recommendation-service')

function Start-JavaService($port, $module) {
    $cmd = "$env:SPRING_PROFILES_ACTIVE='local'; $env:SERVER_PORT='$port'; Set-Location '$($root)\backend'; mvn -q -pl $module spring-boot:run"
    Write-Host "==> Starting $module on port $port" -ForegroundColor Green
    Start-Process -WindowStyle Hidden -FilePath powershell -ArgumentList '-NoExit','-Command',$cmd
}

Start-JavaService 8081 'emergency-service'
Start-JavaService 8082 'ambulance-service'
Start-JavaService 8083 'hospital-service'
Start-JavaService 8084 'traffic-service'

Set-Location (Join-Path $root 'frontend')
if (-not (Test-Path (Join-Path (Join-Path $root 'frontend') 'node_modules'))) {
    Write-Host '==> Installing frontend dependencies...' -ForegroundColor Cyan
    npm install
}
Start-ServiceProcess 'npm' @('run','dev') (Join-Path $root 'frontend')

Write-Host 'All local services have been launched.' -ForegroundColor Green
Write-Host 'Open:'
Write-Host '  Citizen App:        http://localhost:3000/sos'
Write-Host '  Hospital Dashboard: http://localhost:3000/hospital-dashboard'
Write-Host '  Command Center:     http://localhost:3000/command-center'