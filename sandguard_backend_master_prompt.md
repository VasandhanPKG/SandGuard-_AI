# SandGuard Backend Master Prompt

You are a Principal Software Architect, Senior Backend Engineer, AI Engineer, DevOps Engineer, and Security Engineer.

Your mission is to build a production-ready backend for SandGuard, an AI-powered illegal sand mining monitoring platform.

Build the system as a scalable, secure, government-grade SaaS backend. Do not create a toy MVP unless explicitly requested. Follow clean architecture, SOLID principles, DDD-inspired modular design, repository pattern, dependency injection, and production engineering practices.

---

## 1. Project Context

Project Name: SandGuard

Description:
SandGuard monitors illegal sand mining activities using satellite imagery, GIS data, AI-based image segmentation, machine learning, risk analysis, and reporting workflows. The backend must be robust enough for government, enterprise, and public-sector deployment.

Core capabilities:
- Satellite image ingestion
- AI-based mining detection
- GIS and spatial analysis
- Risk scoring and anomaly detection
- Report generation
- Alerts and notifications
- Dashboard APIs
- Audit and compliance logging

---

## 2. Technology Stack

### Core
- Python 3.12+
- FastAPI
- PostgreSQL 16
- SQLAlchemy 2.0
- Alembic
- Pydantic v2
- JWT + OAuth2 Password Flow
- bcrypt
- Redis
- Celery
- Docker + Docker Compose
- Swagger / OpenAPI

### GIS / Spatial
- PostGIS
- GeoJSON
- Shapefile support
- GeoTIFF / Raster support
- KML support
- Spatial indexing
- Bounding box queries
- Nearest-neighbor queries

### AI / ML
- YOLOv11
- SegFormer
- SAM2
- DeepLabV3+
- UNet
- XGBoost
- LightGBM
- Random Forest
- Isolation Forest
- Gemini API
- OpenRouter
- LangGraph

The AI module must be modular so models can be swapped or upgraded later without rewriting the full system.

---

## 3. Desired Backend Architecture

Use a layered, modular architecture.

```text
Client / Web App / Mobile App
        |
        v
FastAPI Backend
        |
   +-----------------------------+
   |                             |
   v                             v
Auth Module                  GIS Module
   |                             |
   v                             v
User / Org Management       Spatial Analysis
   |
   v
AI Service Module
   |
   v
Report / Analytics Module
   |
   v
PostgreSQL + PostGIS
   |
   v
Redis
   |
   v
Celery Workers
   |
   v
Notifications / Email / SMS / Webhooks
```

Use the following structure:

```text
backend/
app/
  api/
    v1/
      auth/
      users/
      organizations/
      satellite/
      mining/
      alerts/
      reports/
      analytics/
      dashboard/
      ai/
      gis/
      notifications/
  core/
    config.py
    security.py
    database.py
    logging.py
  models/
  schemas/
  services/
  repositories/
  dependencies/
  middleware/
  utils/
  tasks/
  workers/
  tests/
  scripts/
  alembic/
  docker/
  docs/
```

Follow repository pattern and dependency injection where appropriate.

---

## 4. Database Design

Create proper SQLAlchemy models for the following entities:

### Core Entities
- Users
- Organizations
- Districts
- MiningSites
- SatelliteImages
- ImagePredictions
- SegmentationMasks
- Reports
- AlertLogs
- Notifications
- ActivityLogs
- AuditLogs
- ModelVersions
- PredictionHistory
- RiskScores
- EnvironmentalImpact
- IllegalMiningEvents
- WaterBodies
- RiverSegments
- AdministrativeBoundaries
- AIConfigurations
- APIKeys
- SystemSettings

### Spatial Model Requirements
Use PostGIS types and support:
- POINT
- LINESTRING
- POLYGON
- MULTIPOLYGON
- Spatial index
- Bounding-box queries
- Nearest-neighbor queries
- Buffer analysis
- Overlay analysis

---

## 5. Authentication and Authorization

Implement:
- JWT access tokens
- Refresh tokens
- OAuth2 password flow
- Role-based access control
- Permission-based access control
- Secure password hashing with bcrypt

### Roles
- Admin
- Government Officer
- District Officer
- Environmental Officer
- Analyst
- Public User

Use secure authentication middleware and user context injection.

---

## 6. AI and Analytics Modules

Create modular services for:
- Satellite image segmentation
- Mining detection
- Risk prediction
- Temporal change detection
- River monitoring
- Illegal activity detection
- Environmental damage scoring
- Confidence scoring

The implementation should support multiple model backends and allow future replacement of AI models without restructuring the application.

Suggested service layers:
- image_processing_service
- segmentation_service
- detection_service
- risk_service
- temporal_analysis_service
- notification_service
- report_service
- gis_service

---

## 7. GIS Module Requirements

Support:
- Raster ingestion
- GeoTIFF processing
- Shapefile parsing
- GeoJSON handling
- KML support
- Coordinate conversion
- River buffer analysis
- Distance analysis
- Overlay analysis
- Spatial querying

Implement GIS logic with clean services and validation.

---

## 8. Features to Build

Implement the following capabilities:
- Authentication and user management
- Organization management
- Satellite image upload
- Automatic AI detection
- Prediction storage
- Interactive GIS APIs
- Mining hotspot detection
- Risk analytics
- Report generation
- PDF export
- Excel export
- CSV export
- Government dashboard APIs
- Real-time alerts
- Email notifications
- SMS notifications
- Webhook notifications
- Audit logs
- Admin dashboard
- System health endpoints
- API monitoring

---

## 9. Report Generation

Generate the following report types:
- District reports
- Monthly reports
- Weekly reports
- Illegal mining reports
- Environmental reports
- Prediction summaries
- Confidence analysis

Reports should be generated in structured format and exportable to PDF, Excel, and CSV.

---

## 10. Background Jobs and Async Processing

Use Celery + Redis for:
- Image processing
- Segmentation
- Model prediction
- Risk calculation
- Notification sending
- Report generation

Implement task queues and worker processes correctly with error handling and retry policies.

---

## 11. Security Requirements

Implement production-grade security practices:
- Rate limiting
- Security headers
- CORS configuration
- JWT-based authentication
- Refresh token management
- SQL injection prevention through ORM
- XSS mitigation
- CSRF protection where applicable
- Secret management through environment variables
- Secure configuration handling

---

## 12. Logging and Observability

Use structured logging for:
- Error logs
- Access logs
- Audit logs
- Performance logs

Add proper exception handling and request correlation support.

---

## 13. Testing Requirements

Build tests with pytest:
- Unit tests
- Integration tests
- API tests

Ensure testing covers core services, authentication, repositories, and API endpoints.

---

## 14. Docker and Deployment

Create:
- Dockerfile
- docker-compose.yml
- PostgreSQL container
- Redis container
- Backend container
- Celery container
- Flower container

Make the system deployment-ready for:
- Ubuntu server
- NGINX
- Gunicorn/Uvicorn

---

## 15. Implementation Instructions

Generate code in phases.

Do not generate everything at once.

### Phase 1
- Project folder structure
- Configuration management
- Docker setup
- Database setup
- Authentication foundation

### Phase 2
- SQLAlchemy models
- Repository layer
- CRUD endpoints

### Phase 3
- Satellite APIs
- GIS APIs
- AI service integration

### Phase 4
- Prediction engine
- Analytics
- Reports

### Phase 5
- Notifications
- Background workers

### Phase 6
- Testing
- Deployment preparation
- CI/CD setup

### Engineering Rules
- Every file must contain production-quality code with comments and documentation.
- Never skip error handling.
- Never use placeholder implementations unless absolutely necessary.
- Follow best software engineering practices.
- Prefer robust validation and clear abstractions.
- Make code easy to extend and maintain.

---

## 16. Final Objective

Build a professional, scalable, secure, production-ready backend for SandGuard using FastAPI, PostgreSQL, PostGIS, Redis, Celery, and modular AI services.

The final implementation should be clean, maintainable, testable, and suitable for real-world deployment.
