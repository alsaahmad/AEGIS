# Smart Emergency Grid - Backend Workflow Implementation

## ✅ Completed Components

### 1. Workflow Orchestrator Service (New Module - Port 8085)
A comprehensive centralized workflow management system that coordinates all emergency response operations.

**Location:** `backend/workflow-orchestrator/`

**Key Features:**
- ✅ Centralized workflow execution tracking
- ✅ Multi-step workflow definition and execution
- ✅ Automatic retry mechanism for failed workflows
- ✅ Real-time status updates via WebSocket
- ✅ Comprehensive monitoring and analytics
- ✅ Database persistence of workflow execution history

**Core Components:**
- **WorkflowOrchestratorService**: Central orchestration logic
- **WorkflowRetryScheduler**: Automatic failed workflow retry (every 30s)
- **WorkflowEventPublisher**: Real-time event broadcasting
- **WorkflowMonitoringService**: Analytics and health metrics
- **WorkflowExecutionRepository**: Database persistence
- **WorkflowStepRepository**: Step-level tracking

### 2. Database Entities
- **WorkflowExecution**: Tracks complete workflow lifecycle
- **WorkflowStep**: Tracks individual step execution within workflows

### 3. Workflow Pipeline (6-Step Process)
```
1. AI Severity Analysis (Port 8001)
   ↓
2. Route Optimization (Port 8002)
   ↓
3. Hospital Recommendation (Port 8003)
   ↓
4. Ambulance Assignment (Port 8082)
   ↓
5. Hospital Notification (Port 8083)
   ↓
6. Traffic Coordination (Port 8084)
```

### 4. REST API Endpoints

**Workflow Management:**
- `POST /api/workflow/emergency` - Initiate emergency workflow
- `GET /api/workflow/status/{emergencyId}` - Get workflow status
- `GET /api/workflow/failed` - List failed workflows
- `POST /api/workflow/retry/{workflowId}` - Retry failed workflow
- `GET /api/workflow/health` - Service health check

**Monitoring & Analytics:**
- `GET /api/workflow/monitoring/stats` - Overall statistics
- `GET /api/workflow/monitoring/health` - System health status
- `GET /api/workflow/monitoring/recent` - Recent workflows
- `GET /api/workflow/monitoring/failed-retry-candidates` - Workflows pending retry

### 5. WebSocket Integration
- Real-time workflow status updates via `/ws/workflow`
- Topic-based subscriptions:
  - `/topic/workflow/{emergencyId}` - Status changes
  - `/topic/workflow-completion/{emergencyId}` - Completion events
  - `/topic/workflow-failure/{emergencyId}` - Failure events
  - `/topic/dashboard/{emergencyId}` - Dashboard updates

### 6. Error Handling & Resilience
- Maximum retries: 3 (configurable)
- Retry delay: 30 seconds (configurable)
- Automatic retry scheduler
- Service timeout: 5 seconds per call
- Detailed error logging and tracking

### 7. Configuration
- **Server Port**: 8085
- **Database**: H2 (in-memory)
- **Retry Strategy**: Automatic with exponential backoff
- **Logging**: DEBUG level for detailed tracing

## 📊 System Architecture

```
┌─────────────┐
│  Frontend   │
│ (Port 3000) │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────┐
│   Workflow Orchestrator Service      │
│         (Port 8085)                  │
├──────────────────────────────────────┤
│ • Workflow Execution Management      │
│ • Real-time Event Publishing         │
│ • Automatic Retry Scheduling         │
│ • Monitoring & Analytics             │
└──────┬──────────────────────────────┬┘
       │                              │
       ▼                              ▼
┌─────────────────────────┐  ┌─────────────────────────┐
│   Core Services         │  │   AI Services           │
├─────────────────────────┤  ├─────────────────────────┤
│ • Emergency (8081)      │  │ • Severity (8001)       │
│ • Ambulance (8082)      │  │ • Route Optim (8002)    │
│ • Hospital (8083)       │  │ • Hospital Rec (8003)   │
│ • Traffic (8084)        │  │                         │
└─────────────────────────┘  └─────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Maven 3.8+
- Python 3.11+
- Node.js 18+

### Complete Startup (All Services)
```powershell
.\start-local-complete.ps1
```

This script will automatically:
1. Build all backend services
2. Start AI services (Python)
3. Start microservices (Java/Spring Boot)
4. Start frontend (Next.js)
5. Display all service endpoints

### Service URLs After Startup
```
Frontend:                 http://localhost:3000
Workflow Orchestrator:    http://localhost:8085
Emergency Service:        http://localhost:8081
Ambulance Service:        http://localhost:8082
Hospital Service:         http://localhost:8083
Traffic Service:          http://localhost:8084
AI Severity:             http://localhost:8001
Route Optimization:       http://localhost:8002
Hospital Recommendation:  http://localhost:8003
```

## 📝 Usage Examples

### 1. Initiate Emergency Workflow
```bash
curl -X POST http://localhost:8085/api/workflow/emergency \
  -H "Content-Type: application/json" \
  -d '{
    "emergencyId": "emg-12345",
    "workflowType": "EMERGENCY_RESPONSE",
    "severity": "HIGH",
    "location": "12.9716,77.5946",
    "description": "Major accident on highway",
    "emergencyData": "{...}"
  }'
```

### 2. Get Workflow Status
```bash
curl http://localhost:8085/api/workflow/status/emg-12345
```

### 3. Get System Statistics
```bash
curl http://localhost:8085/api/workflow/monitoring/stats
```

### 4. Get System Health
```bash
curl http://localhost:8085/api/workflow/monitoring/health
```

### 5. View Failed Workflows
```bash
curl http://localhost:8085/api/workflow/failed
```

### 6. Retry Failed Workflow
```bash
curl -X POST http://localhost:8085/api/workflow/retry/1 \
  -H "Content-Type: application/json" \
  -d '{
    "emergencyId": "emg-12345",
    "workflowType": "EMERGENCY_RESPONSE",
    "emergencyData": "{...}"
  }'
```

## 📊 Database Schema

### Workflow Execution Table
Stores complete workflow lifecycle information with status tracking and error handling.

### Workflow Step Table
Tracks individual step execution with input/output data for audit trails.

## 🔍 Monitoring & Debugging

### View Workflow Statistics
```
GET /api/workflow/monitoring/stats
```
Returns: Total, completed, failed, pending counts with success/failure rates

### Check System Health
```
GET /api/workflow/monitoring/health
```
Returns: Health status (HEALTHY/WARNING/CRITICAL) with metrics

### View Recent Workflows
```
GET /api/workflow/monitoring/recent?limit=10
```
Returns: Last 10 workflows with full details

### Track Failed Workflows
```
GET /api/workflow/monitoring/failed-retry-candidates
```
Returns: Workflows eligible for retry

## 🛡️ Error Handling

**Automatic Retry Logic:**
- Failed steps automatically retry up to 3 times
- Retry scheduler runs every 30 seconds
- Each retry increments counter and logs timestamp

**Timeout Management:**
- 5-second timeout per service call
- Non-blocking architecture for critical operations
- Fallback mechanisms ensure emergency isn't blocked

**Error Logging:**
- All errors logged with full context
- Error messages stored in database
- Stack traces available for debugging

## 📦 Build & Deploy

### Build Only
```bash
cd backend
mvn clean package -DskipTests
```

### Build Specific Module
```bash
mvn -pl workflow-orchestrator clean package
```

### Run Specific Service
```bash
mvn -pl workflow-orchestrator spring-boot:run
```

## 📚 Documentation

Comprehensive documentation available in:
- [WORKFLOW_ORCHESTRATOR.md](./WORKFLOW_ORCHESTRATOR.md) - Detailed API docs and integration guide

## ✨ Key Improvements

1. **Centralized Orchestration**: All workflows go through one coordinator
2. **Reliability**: Automatic retry with exponential backoff
3. **Traceability**: Every step logged with input/output
4. **Monitoring**: Real-time statistics and health metrics
5. **Scalability**: Event-driven architecture supports growth
6. **Real-time Updates**: WebSocket integration for operator dashboards

## 🔄 Workflow Status States

- **PENDING** - Created, waiting to start
- **IN_PROGRESS** - Executing workflow steps
- **COMPLETED** - All steps successful
- **FAILED** - One or more steps failed
- **RETRY_PENDING** - Marked for automatic retry
- **CANCELLED** - Workflow cancelled by operator

## 🎯 Next Steps

1. **Frontend Integration** - Connect real-time updates to operator dashboard
2. **Performance Tuning** - Optimize service timeouts based on metrics
3. **Extended Testing** - Load test with simulated emergency volume
4. **Alerting** - Setup email/SMS alerts for critical failures
5. **Analytics Dashboard** - Build analytics UI for workflow metrics

## 📝 Build Status

✅ **Build Successful** - All modules compile and package correctly
✅ **Maven Reactor Summary** - 6 modules built successfully in ~39 seconds

Modules:
- ✅ common
- ✅ workflow-orchestrator (NEW)
- ✅ emergency-service
- ✅ ambulance-service
- ✅ hospital-service
- ✅ traffic-service
