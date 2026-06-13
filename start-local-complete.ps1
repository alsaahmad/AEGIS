#!/usr/bin/env pwsh

# Smart Emergency Grid - Complete Backend Startup Script
# This script starts all backend services with proper workflow orchestration

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Smart Emergency Grid - Backend Services Startup" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

$rootDir = (Get-Location).Path
$backendDir = Join-Path $rootDir "backend"

# Colors for output
$successColor = "Green"
$errorColor = "Red"
$infoColor = "Blue"

function Log-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $infoColor
}

function Log-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $successColor
}

function Log-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $errorColor
}

# Build backend
Log-Info "Building backend services..."
Set-Location $backendDir

try {
    mvn clean package -DskipTests -q
    Log-Success "Backend build completed successfully"
} catch {
    Log-Error "Backend build failed: $_"
    exit 1
}

# Start Python services
Log-Info "Starting Python AI services..."

$pythonServices = @(
    @{ Name = "AI Severity Service"; Port = 8001; Path = "ai-severity-service" },
    @{ Name = "Route Optimization Service"; Port = 8002; Path = "route-optimization-service" },
    @{ Name = "Hospital Recommendation Service"; Port = 8003; Path = "hospital-recommendation-service" }
)

foreach ($service in $pythonServices) {
    Log-Info "Starting $($service.Name) on port $($service.Port)..."
    Start-Process -WindowStyle Hidden -FilePath python `
        -ArgumentList "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", $service.Port `
        -WorkingDirectory (Join-Path $rootDir $service.Path)
    Start-Sleep -Seconds 2
    Log-Success "$($service.Name) started"
}

# Start Java services
Log-Info "Starting Java Spring Boot services..."

$javaServices = @(
    @{ Name = "Workflow Orchestrator"; Port = 8085; Module = "workflow-orchestrator" },
    @{ Name = "Emergency Service"; Port = 8081; Module = "emergency-service" },
    @{ Name = "Ambulance Service"; Port = 8082; Module = "ambulance-service" },
    @{ Name = "Hospital Service"; Port = 8083; Module = "hospital-service" },
    @{ Name = "Traffic Service"; Port = 8084; Module = "traffic-service" }
)

foreach ($service in $javaServices) {
    Log-Info "Starting $($service.Name) on port $($service.Port)..."
    $profileArg = if ($service.Module -eq "workflow-orchestrator") { "default" } else { "local" }
    
    Start-Process -WindowStyle Hidden -FilePath pwsh `
        -ArgumentList "-NoExit", "-Command", `
        "`$env:SPRING_PROFILES_ACTIVE='$profileArg'; `$env:SERVER_PORT='$($service.Port)'; cd '$backendDir'; mvn -q -pl $($service.Module) spring-boot:run"
    
    Start-Sleep -Seconds 3
    Log-Success "$($service.Name) started"
}

# Start frontend
Log-Info "Starting Frontend (Next.js)..."
$frontendDir = Join-Path $rootDir "frontend"
Set-Location $frontendDir

if (-not (Test-Path "node_modules")) {
    Log-Info "Installing frontend dependencies..."
    npm install
}

Start-Process -WindowStyle Hidden -FilePath npm -ArgumentList "run", "dev"
Log-Success "Frontend started on port 3000"

# Summary
Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "All Services Started Successfully!" -ForegroundColor $successColor
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service Endpoints:" -ForegroundColor $infoColor
Write-Host "  Frontend:                    http://localhost:3000" -ForegroundColor White
Write-Host "  Workflow Orchestrator:       http://localhost:8085" -ForegroundColor White
Write-Host "  Emergency Service:           http://localhost:8081" -ForegroundColor White
Write-Host "  Ambulance Service:           http://localhost:8082" -ForegroundColor White
Write-Host "  Hospital Service:            http://localhost:8083" -ForegroundColor White
Write-Host "  Traffic Service:             http://localhost:8084" -ForegroundColor White
Write-Host ""
Write-Host "AI Services:" -ForegroundColor $infoColor
Write-Host "  AI Severity:                 http://localhost:8001" -ForegroundColor White
Write-Host "  Route Optimization:          http://localhost:8002" -ForegroundColor White
Write-Host "  Hospital Recommendation:     http://localhost:8003" -ForegroundColor White
Write-Host ""
Write-Host "Workflow APIs:" -ForegroundColor $infoColor
Write-Host "  Initiate Emergency:          POST /api/workflow/emergency" -ForegroundColor White
Write-Host "  Get Workflow Status:         GET /api/workflow/status/{emergencyId}" -ForegroundColor White
Write-Host "  Get Failed Workflows:        GET /api/workflow/failed" -ForegroundColor White
Write-Host "  Retry Failed Workflow:       POST /api/workflow/retry/{workflowId}" -ForegroundColor White
Write-Host ""
Write-Host "Monitoring APIs:" -ForegroundColor $infoColor
Write-Host "  Workflow Stats:              GET /api/workflow/monitoring/stats" -ForegroundColor White
Write-Host "  Health Status:               GET /api/workflow/monitoring/health" -ForegroundColor White
Write-Host "  Recent Workflows:            GET /api/workflow/monitoring/recent" -ForegroundColor White
Write-Host ""
