# StayEase Payment and Notification Service

This service is Student 4's component in the StayEase microservice system. It handles payment processing, refunds, and user notifications after successful payments.

## 1. What this service does

- Processes booking payments.
- Stores payment status (pending, success, failed, refunded).
- Issues refunds by booking ID.
- Sends and stores notification records (email/SMS).
- Validates user identity through Auth Service.
 - Supports payment gateway mode (`mock` or `stripe`).

## 2. How the system works (step by step)

### Step 1 - Booking Service calls Payment API
Booking Service sends a request to POST /payments when a booking is confirmed.

### Step 2 - Payment Service validates user token
Payment Service uses bearer token and calls Auth Service GET /auth/verify.
If invalid, request is rejected with 401.

### Step 3 - Payment is processed
Payment record is created with transactionId and status.
Status is simulated as mostly success to demonstrate flow.

### Step 4 - Notification is triggered
If payment succeeds and contact details are provided, notification is created and stored.

### Step 5 - Other services can query state
Booking Service or frontend can fetch payment status via GET /payments/:bookingId.

### Step 6 - Refund support
Authorized users can call POST /payments/refund to mark latest payment as refunded.

### Step 7 - Notification history
Authorized users can call GET /notifications/history?userId=<id> to fetch message history.

## 3. Inter-service integration guide (for teammates)

### Booking Service -> Payment Service
Call:
- POST /payments
Payload:
- bookingId, userId, amount, currency
- optional contact: { channel: email|sms, destination }

Expected result:
- 201 with payment object and status.

### Payment Service -> Auth Service
Call:
- GET {AUTH_SERVICE_URL}/auth/verify
Header:
- Authorization: Bearer <token>

Expected result:
- user identity fields (userId/id).

### Internal notification route
Route:
- POST /notifications/send
Header:
- x-internal-service-key: <INTERNAL_SERVICE_KEY>

Use this only for service-to-service operations.

## 4. API endpoints

- GET /health
- POST /payments
- GET /payments/:bookingId
- POST /payments/refund
- POST /notifications/send
- GET /notifications/history

See full contract in swagger.yaml.

## 5. Local setup

1. Install dependencies:
```bash
npm install
```

2. Create .env from .env.example and set values:
- PORT
- MONGO_URI
- AUTH_SERVICE_URL
- INTERNAL_SERVICE_KEY
- PAYMENT_GATEWAY_MODE
- STRIPE_SECRET_KEY (required when `PAYMENT_GATEWAY_MODE=stripe`)
- STRIPE_DEFAULT_PAYMENT_METHOD_ID (optional, default: `pm_card_visa`)

3. Run service:
```bash
npm run dev
```

4. Health check:
```bash
GET http://localhost:4004/health
```

## 6. Docker

### Build and run with Docker Compose
```bash
docker compose up --build
```

This starts:
- payment-service on port 4004
- mongodb on port 27017

## 7. CI/CD and quality

- GitHub Actions workflow: .github/workflows/ci.yml
- GitHub Actions workflow (CD): .github/workflows/cd-azure-containerapp.yml
- Sonar config: sonar-project.properties

CI pipeline runs install, lint, test, docker build, and SonarCloud scan.
CD pipeline builds image, pushes to Docker Hub, and deploys to Azure Container Apps.

Quality gate in this repo:
- Lint runs with zero warnings allowed.
- Jest API tests run with coverage report output.

## 8. Cloud deployment (Azure Container Apps)

This repository includes cloud deployment artifacts for managed container orchestration:
- Deployment workflow: `.github/workflows/cd-azure-containerapp.yml`
- Container App manifest: `infra/azure/containerapp.yaml`

### Required GitHub repository secrets

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `AZURE_CREDENTIALS`
- `AZURE_RESOURCE_GROUP`
- `AZURE_CONTAINER_APP_NAME`
- `SONAR_TOKEN` (for SonarCloud in CI)

### Deployment behavior

- On push to `main`, CD workflow builds and pushes:
  - `<dockerhub-user>/stayease-payment-service:latest`
  - `<dockerhub-user>/stayease-payment-service:<git-sha>`
- CD then deploys the pushed image to Azure Container Apps.
- If required secrets are missing, workflow prints a clear notice and skips deployment safely.

## 9. Project structure

src/
- routes/ API endpoints
- controllers/ request handlers
- models/ MongoDB schemas
- middleware/ auth, validation, error handling
- services/ business logic and integrations

## 10. Quick integration examples

### Create payment example
```http
POST /payments
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "bookingId": "BK1001",
  "userId": "USR1001",
  "amount": 25000,
  "currency": "LKR",
  "contact": {
    "channel": "email",
    "destination": "user@example.com"
  }
}
```

### Get payment status example
```http
GET /payments/BK1001
Authorization: Bearer <jwt>
```

### Refund example
```http
POST /payments/refund
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "bookingId": "BK1001",
  "reason": "Customer cancelled"
}
```

## 11. Notes for final demo

- Show successful payment flow from Booking to Payment.
- Show failed auth request.
- Show refund update.
- Show notification history and stored records.

## 12. Test and quality commands

Run lint check:
```bash
npm run lint
```

Run automated tests with coverage:
```bash
npm test
```

Run tests in watch mode during development:
```bash
npm run test:watch
```

Current automated coverage focuses on:
- Health endpoint behavior
- Payment API behavior and auth guard behavior
- Notification API behavior including internal key protection

## 13. Full local integration run (recommended for demo)

Run MongoDB container only:
```bash
docker compose up -d payment-mongodb
```

Start mock Auth service in terminal 1:
```bash
npm run mock:auth
```

Start payment service in terminal 2 (PowerShell):
```powershell
$env:MONGO_URI="mongodb://localhost:27017/stayease_payment_db"
$env:AUTH_SERVICE_URL="http://localhost:4001"
$env:INTERNAL_SERVICE_KEY="replace-this-with-strong-random-value"
npm start
```

Run smoke integration in terminal 3:
```bash
npm run smoke:integration
```

Expected smoke output:
- Payment created
- Payment fetched
- Internal notification sent
- Notification history count shown
- Refund status updated

Stop docker resources:
```bash
docker compose down
```

## 14. Postman collection

Import this file into Postman:
- documents/StayEase_Payment_Service.postman_collection.json

Detailed run instructions for backend, frontend, and docker:
- documents/RUN_GUIDE_BACKEND_FRONTEND_DOCKER.md

Collection variables required:
- baseUrl
- token
- internalServiceKey

## 15. Development progress (step by step)

Step 1 completed:
- Project initialized with Express + MongoDB stack.
- Base folder structure created: routes, controllers, models, middleware, services.

Step 2 completed:
- Payment schema implemented with required statuses and transactionId.
- Notification schema implemented for audit/history tracking.

Step 3 completed:
- Payment APIs implemented:
  - POST /payments
  - GET /payments/:bookingId
  - POST /payments/refund

Step 4 completed:
- Notification APIs implemented:
  - POST /notifications/send (internal)
  - GET /notifications/history

Step 5 completed:
- Auth integration middleware added via Auth Service /auth/verify.
- Internal service-key protection added for notification send endpoint.
- Request validation middleware added to all endpoints.

Step 6 completed:
- Swagger API contract written in swagger.yaml.
- Dockerfile and docker-compose.yml added for containerized run.
- GitHub Actions CI workflow added.
- SonarCloud configuration added.

Step 7 completed:
- Baseline local checks run (syntax, lint script, test script placeholders).

Step 8 completed:
- Added ESLint configuration with strict quality gate (no warnings).
- Added Jest + Supertest API test suite and coverage output.
- Added Docker ignore for cleaner container builds.

Step 9 completed:
- Added local mock Auth service for integration and demo readiness.
- Added smoke test runner script for end-to-end verification.
- Added Postman collection for manual API demo and team integration.

Next immediate integration step for teammates:
- Booking team can now call POST /payments directly with bearer token and booking payload.
- Auth team must expose GET /auth/verify with userId/id in response.
- API gateway team can map /payments and /notifications routes to this service base URL.

### Payment gateway modes

- `mock` mode (default): uses simulated payment outcome for local/demo flow.
- `stripe` mode: uses Stripe Payment Intents and Stripe Refund API.

To enable Stripe mode in `.env`:

```dotenv
PAYMENT_GATEWAY_MODE=stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_DEFAULT_PAYMENT_METHOD_ID=pm_card_visa
```
