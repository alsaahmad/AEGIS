# Workflow Orchestrator Service

## Overview

The Workflow Orchestrator Service is the central coordinator for the Smart Emergency Grid system. It manages the complete emergency response lifecycle, orchestrating communication between multiple microservices and ensuring reliable, traceable execution of emergency workflows.

## Architecture

### Service Components

1. **Emergency Service** (Port 8081) - Receives emergency reports
2. **Ambulance Service** (Port 8082) - Manages ambulance assignments
3. **Hospital Service** (Port 8083) - Hospital notifications and bed management
4. **Traffic Service** (Port 8084) - Traffic signal coordination
5. **Workflow Orchestrator** (Port 8085) - Central workflow management
6. **AI Services**
   - Severity Analysis (Port 8001)
   - Route Optimization (Port 8002)
   - Hospital Recommendation (Port 8003)

### Workflow Pipeline

```
Emergency Reported
    ↓
[Step 1] AI Severity Analysis
    ↓
[Step 2] Route Optimization
    ↓
[Step 3] Hospital Recommendation
    ↓
[Step 4] Ambulance Assignment
    ↓
[Step 5] Hospital Notification
    ↓
[Step 6] Traffic Coordination
    ↓
Workflow Completed
```

## Features

### 1. **Workflow Execution Tracking**
- Each emergency creates a workflow execution record
- Every step is tracked with input/output data
- Real-time status updates via WebSocket

### 2. **Resilience & Retry Logic**
- Automatic retry for failed workflows (configurable max retries: 3)
- Failed workflows tracked for manual review
- Detailed error logging for debugging

### 3. **Real-time Monitoring**
- Live workflow status via WebSocket (`/ws/workflow`)
- Workflow statistics and health metrics
- Dashboard updates for operators

### 4. **Event-Driven Architecture**
- Publish workflow status changes
- Emit completion/failure events
- Dashboard event broadcasting

## API Endpoints

### Workflow Management

#### Initiate Emergency Workflow
```
POST /api/workflow/emergency
Content-Type: application/json

{
  "emergencyId": "uuid-string",
  "workflowType": "EMERGENCY_RESPONSE",
  "severity": "HIGH",
  "location": "lat,lng",
  "description": "accident details",
  "emergencyData": "JSON serialized data"
}

Response:
{
  "workflowId": 1,
  "emergencyId": "uuid-string",
  "status": "IN_PROGRESS",
  "workflowType": "EMERGENCY_RESPONSE",
  "startedAt": "2026-06-13T10:30:00",
  "completedAt": null,
  "errorMessage": null
}
```

#### Get Workflow Status
```
GET /api/workflow/status/{emergencyId}

Response:
{
  "workflowId": 1,
  "emergencyId": "uuid-string",
  "status": "COMPLETED",
  "workflowType": "EMERGENCY_RESPONSE",
  "startedAt": "2026-06-13T10:30:00",
  "completedAt": "2026-06-13T10:31:45",
  "errorMessage": null
}
```

#### Get Failed Workflows
```
GET /api/workflow/failed

Response:
[
  {
    "workflowId": 2,
    "emergencyId": "uuid-string",
    "status": "FAILED",
    "errorMessage": "Service timeout",
    "retryCount": 1
  }
]
```

#### Retry Failed Workflow
```
POST /api/workflow/retry/{workflowId}
Content-Type: application/json

{
  "emergencyId": "uuid-string",
  "workflowType": "EMERGENCY_RESPONSE",
  "emergencyData": "..."
}

Response: 200 OK
```

### Monitoring & Analytics

#### Get Workflow Statistics
```
GET /api/workflow/monitoring/stats

Response:
{
  "total": 150,
  "completed": 145,
  "failed": 3,
  "pending": 2,
  "in_progress": 0,
  "success_rate": 96.67,
  "failure_rate": 2.0,
  "timestamp": "2026-06-13T10:45:00"
}
```

#### Get Health Status
```
GET /api/workflow/monitoring/health

Response:
{
  "status": "HEALTHY",
  "success_rate": 96.67,
  "total_workflows": 150,
  "completed_workflows": 145,
  "failed_workflows": 3,
  "timestamp": "2026-06-13T10:45:00"
}
```

#### Get Recent Workflows
```
GET /api/workflow/monitoring/recent?limit=10

Response:
[
  {
    "id": 1,
    "emergency_id": "uuid",
    "workflow_name": "EMERGENCY_RESPONSE_WORKFLOW",
    "status": "COMPLETED",
    "type": "EMERGENCY_RESPONSE",
    "retry_count": 0,
    "started_at": "2026-06-13T10:30:00",
    "completed_at": "2026-06-13T10:31:45",
    "error_message": null,
    "created_at": "2026-06-13T10:30:00"
  }
]
```

#### Get Failed Workflows Pending Retry
```
GET /api/workflow/monitoring/failed-retry-candidates?limit=10

Response: Same as Recent Workflows but filtered for FAILED status and retry_count < 3
```

## WebSocket Integration

### Connect to Workflow Updates
```
ws://localhost:8085/ws/workflow
```

### Subscribe to Workflow Status
```
SUBSCRIBE
destination:/topic/workflow/{emergencyId}
```

### Subscribe to Workflow Completion
```
SUBSCRIBE
destination:/topic/workflow-completion/{emergencyId}
```

### Subscribe to Workflow Failure
```
SUBSCRIBE
destination:/topic/workflow-failure/{emergencyId}
```

### Subscribe to Dashboard Updates
```
SUBSCRIBE
destination:/topic/dashboard/{emergencyId}
```

## Database Schema

### WorkflowExecution Table
```sql
CREATE TABLE workflow_execution (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  workflow_name VARCHAR(255) NOT NULL,
  emergency_id VARCHAR(255) NOT NULL,
  status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED', 'RETRY_PENDING'),
  type ENUM('EMERGENCY_RESPONSE', 'AMBULANCE_ASSIGNMENT', 'HOSPITAL_NOTIFICATION', ...),
  metadata TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  error_message TEXT,
  retry_count INT DEFAULT 0,
  last_retry_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### WorkflowStep Table
```sql
CREATE TABLE workflow_step (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  workflow_execution_id BIGINT NOT NULL,
  step_name VARCHAR(255) NOT NULL,
  step_order INT NOT NULL,
  status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', ...),
  input TEXT,
  output TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  error_message TEXT,
  service_name VARCHAR(255),
  service_endpoint VARCHAR(255),
  created_at TIMESTAMP,
  FOREIGN KEY (workflow_execution_id) REFERENCES workflow_execution(id)
);
```

## Configuration

### application.properties
```properties
# Server
spring.application.name=workflow-orchestrator
server.port=8085

# Database
spring.datasource.url=jdbc:h2:mem:workflow_db
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.hibernate.ddl-auto=update

# Workflow Configuration
workflow.max.retries=3
workflow.retry.delay.seconds=30
workflow.timeout.seconds=300

# Logging
logging.level.com.lifeline.grid=DEBUG
```

## Startup Instructions

### Using the Complete Startup Script
```powershell
.\start-local-complete.ps1
```

This will start all services in the following order:
1. Build backend with Maven
2. Start Python AI services
3. Start Java microservices
4. Start Frontend

### Manual Startup

**Terminal 1 - Workflow Orchestrator:**
```bash
cd backend
mvn -pl workflow-orchestrator spring-boot:run -Dspring-boot.run.arguments=--server.port=8085
```

**Terminal 2 - AI Services:**
```bash
cd ai-severity-service
python -m uvicorn app:app --host 0.0.0.0 --port 8001
```

**Terminal 3 - Emergency Service:**
```bash
cd backend
mvn -pl emergency-service spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

## Workflow Lifecycle

### 1. PENDING
- Workflow created but not yet started
- Initial validation of request data

### 2. IN_PROGRESS
- Workflow steps are executing
- Service calls are being made
- Status updates published

### 3. COMPLETED
- All steps executed successfully
- Final workflow completion event published
- Results logged for audit trail

### 4. FAILED
- One or more steps failed
- Error details captured
- Eligible for retry if retry_count < max_retries

### 5. RETRY_PENDING
- Workflow marked for retry
- Retry count incremented
- Last retry time updated

## Error Handling

### Retry Strategy
- Maximum retries: 3 (configurable)
- Retry delay: 30 seconds (configurable)
- Automatic retry scheduler runs every 30 seconds
- Manual retry available via API

### Fallback Mechanisms
- Service timeouts: 5 seconds per service call
- Partial workflow completion allowed with detailed error logging
- Never block emergency response due to non-critical service failure

## Monitoring & Observability

### Health Checks
```bash
curl http://localhost:8085/api/workflow/health
```

### Metrics
- Success rate: (completed / total) * 100
- Failure rate: (failed / total) * 100
- System status: HEALTHY | WARNING | CRITICAL

### Logging
- DEBUG: Detailed step execution logs
- INFO: Workflow state changes
- WARN: Retry attempts, fallback triggers
- ERROR: Workflow failures, service errors

## Integration with Frontend

### Real-time Updates via WebSocket
The frontend can subscribe to workflow events using STOMP protocol over WebSocket.

```javascript
const client = new StompJs.Client({
  brokerURL: 'ws://localhost:8085/ws/workflow',
  reconnectDelay: 5000,
});

client.onConnect = function(frame) {
  client.subscribe('/topic/workflow/' + emergencyId, function(message) {
    const update = JSON.parse(message.body);
    // Update UI with workflow status
  });
};

client.activate();
```

## Best Practices

1. **Always use the Workflow Orchestrator** for emergency workflows, never call services directly
2. **Monitor failed workflows** regularly using the monitoring endpoints
3. **Configure appropriate timeouts** based on your infrastructure
4. **Implement exponential backoff** for client-side retry logic
5. **Log all emergency IDs** for audit trail and compliance
6. **Use WebSocket for real-time updates** in operator dashboards

## Troubleshooting

### Workflow Stuck in IN_PROGRESS
1. Check workflow_step table for incomplete steps
2. Review service logs for timeout errors
3. Manually retry using POST /api/workflow/retry/{workflowId}

### High Failure Rate
1. Check health of all microservices
2. Review error messages in failed workflows
3. Check network connectivity and service endpoints
4. Verify AI service availability

### Database Errors
1. Check H2 database console at http://localhost:8085/h2-console
2. Verify schema creation (should auto-create with ddl-auto=update)
3. Check database logs for SQL errors
