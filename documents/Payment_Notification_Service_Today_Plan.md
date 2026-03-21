# StayEase Payment & Notification Service - Full Marks Execution Plan (Today)

Date: 2026-03-21
Owner: Student 4 (Payment & Notification Service)
Target: Complete a submission-ready service and report section today, aligned with the group report requirements.

## 1) What must be delivered for your service (from the group report)

### Mandatory endpoints
- POST /payments - process payment for booking (auth required)
- GET /payments/:bookingId - get payment by booking ID (auth required)
- POST /payments/refund - issue refund (auth required)
- POST /notifications/send - send email/SMS (internal)
- GET /notifications/history - notification history by user (auth required)

### Required schema
- Payment model fields:
  - id, bookingId, userId, amount, currency
  - status in [pending, success, failed, refunded]
  - transactionId, createdAt

### Required integration points
- Calls Auth Service: GET /auth/verify for token validation
- Called by Booking Service: POST /payments after booking confirmation
- Internal trigger: successful payment -> send notification (email/SMS)

### Required repository artifacts
- src/routes, src/controllers, src/models, src/middleware
- Dockerfile
- docker-compose.yml
- .github/workflows/ci.yml
- swagger.yaml
- .env.example
- .gitignore
- package.json
- README.md
- sonar-project.properties

## 2) Full marks strategy (mapped to rubric)

- Practicality & Functionality (10%): all endpoints running locally and at least one deployed URL working.
- DevOps Practices & Cloud (30%): Docker build + GitHub Actions pipeline + deployment evidence.
- Inter-service Communication (10%): prove Booking -> Payment flow and Payment -> Auth verification.
- Security & DevSecOps (20%): JWT verification, input validation, secrets in env, SonarCloud green quality gate.
- Code Quality (20%): clean layered architecture, consistent error handling, meaningful logs, lint clean.
- Report & Demonstration (10%): complete individual sections with screenshots, API examples, and live demo script.

## 3) Today schedule (finish within one day)

## 09:00-10:00 - Foundation and project structure
- Confirm Node.js project structure matches required folders.
- Create missing files from required checklist.
- Define env variables in .env.example:
  - PORT, MONGO_URI, AUTH_SERVICE_URL
  - EMAIL_PROVIDER_API_KEY (or SMTP fields)
  - SMS_PROVIDER_API_KEY (optional), JWT settings if needed
- Add centralized error format and request logger.

Exit criteria:
- Project runs locally without crashing.
- All required folders/files exist.

## 10:00-12:00 - Core Payment APIs
- Implement Payment model.
- Implement controllers and routes for:
  - POST /payments
  - GET /payments/:bookingId
  - POST /payments/refund
- Add validation middleware for all request bodies/params.
- Add deterministic payment simulation:
  - create transactionId
  - status transitions pending -> success/failed
- Persist every payment event in DB.

Exit criteria:
- Postman tests pass for success + failure + refund flows.

## 12:00-13:00 - Auth integration and security hardening
- Implement auth middleware that calls Auth Service GET /auth/verify.
- Protect all user-facing endpoints.
- Restrict /notifications/send as internal-only route (secret header or service token).
- Add input sanitization and consistent 4xx/5xx responses.

Exit criteria:
- Unauthorized calls fail; valid token calls succeed.

## 13:00-14:30 - Notification module
- Implement POST /notifications/send:
  - email and SMS channel abstraction
  - fallback to mock provider if real keys unavailable
- Implement GET /notifications/history by user.
- Trigger notification automatically after successful payment.
- Store notification logs for audit/demo proof.

Exit criteria:
- Successful payment creates notification history record.

## 14:30-15:30 - API contract + documentation
- Complete swagger.yaml for all endpoints, schemas, request/response examples, auth requirements.
- Update README with:
  - setup
  - env variables
  - run commands
  - endpoint summary
  - integration flow with Booking and Auth

Exit criteria:
- Swagger UI clearly demonstrates all APIs and security requirements.

## 15:30-17:00 - DevOps completion
- Dockerfile optimized for production node image.
- docker-compose.yml with service + MongoDB (local).
- GitHub Actions ci.yml:
  - install
  - lint
  - test
  - docker build
- Add sonar-project.properties and run scan.

Exit criteria:
- Pipeline passes on develop/main.

## 17:00-18:30 - Integration and evidence collection
- Run end-to-end flow with Booking service trigger.
- Capture evidence screenshots/logs:
  - booking creates payment
  - payment success triggers notification
  - refund path
  - auth failure path
- Save Postman collection and test results.

Exit criteria:
- End-to-end proof for inter-service communication is ready.

## 18:30-20:00 - Individual report writing (high-score format)
- Fill each required section with concrete evidence:
  - 9.1 Introduction
  - 9.2 Architecture & Design
  - 9.3 API Endpoints (table + sample payloads)
  - 9.4 Inter-Service Communication (sequence + code snippets)
  - 9.5 DevOps Practices (pipeline screenshots)
  - 9.6 Security Measures (JWT, validation, Sonar)
  - 9.7 Challenges & Solutions
  - 9.8 Conclusion
- Keep screenshots labeled and referenced in text.

Exit criteria:
- Your report section is final-draft quality and ready for submission.

## 4) Minimum technical implementation checklist

- Payment model with status lifecycle and transactionId.
- Auth middleware integrated with Auth Service verification endpoint.
- Validation middleware on every endpoint.
- Notification abstraction supporting email/SMS + mock fallback.
- Structured logging and consistent error response schema.
- Swagger contract complete and matching actual code.
- Unit tests for controller/service logic.
- Integration tests for payment + notification trigger.

## 5) Demo script for marks (10 minutes)

- Show architecture and your service boundaries (1 min).
- Show Swagger endpoints and auth requirements (1 min).
- Run payment success flow from Booking -> Payment -> Notification (3 min).
- Run refund flow and show status update (2 min).
- Show auth rejection for invalid token (1 min).
- Show GitHub Actions + SonarCloud quality gate + Docker image build (2 min).

## 6) Risk control (so you still finish today)

- If email/SMS providers fail:
  - use mock provider and persist notification logs as proof of trigger mechanism.
- If cloud deploy delays:
  - finish local Docker + CI + full integration evidence first.
- If integration with Booking service is delayed:
  - create a temporary internal test endpoint or Postman sequence that mimics Booking payload.

## 7) Final submission checklist before end of day

- All required endpoints implemented and tested.
- All required files present in repository.
- CI pipeline green.
- SonarCloud analyzed with no major blockers.
- Swagger and README fully updated.
- Individual report section completed with evidence.
- Demo flow rehearsed once end-to-end.

## 8) Suggested commit plan (clean history)

- feat(payment): implement payment model and core payment endpoints
- feat(notification): implement notification sender and history endpoints
- feat(security): add auth verification middleware and validation
- docs(api): add swagger contract and README usage
- chore(devops): add Docker, CI workflow, sonar config
- test(payment): add unit/integration coverage for payment-notification flow
- docs(report): add individual report section with evidence

This plan is designed to maximize rubric coverage while ensuring completion within one day.