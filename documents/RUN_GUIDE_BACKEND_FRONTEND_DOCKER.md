# StayEase Payment Service Run Guide (Backend + Frontend + Docker)

## 1. Prerequisites

- Node.js 18+ installed
- npm installed
- Docker Desktop installed and running (only needed for local MongoDB container flow)
- PowerShell terminal

Project paths:
- Backend root: `C:/Users/ThevinduRathnaweera/OneDrive - Algospring (PVT) LTD/Desktop/SLIIT_RESEARCH/CTSE/stayease-payment-service`
- Frontend root: `C:/Users/ThevinduRathnaweera/OneDrive - Algospring (PVT) LTD/Desktop/SLIIT_RESEARCH/CTSE/stayease-payment-service/frontend/frontend_stayease`

---

## 2. Environment Setup

### Backend `.env`

Ensure backend `.env` has valid values:

```dotenv
PORT=4004
MONGO_URI=mongodb+srv://payment_db_user:YOUR_PASSWORD@cluster0.oq5fi1m.mongodb.net/?appName=Cluster0
AUTH_SERVICE_URL=http://localhost:4001
INTERNAL_SERVICE_KEY=your-strong-internal-key
PAYMENT_GATEWAY_MODE=mock
STRIPE_SECRET_KEY=
STRIPE_DEFAULT_PAYMENT_METHOD_ID=pm_card_visa
```

Payment gateway modes:
- `mock` (default): simulated payment status for local/demo.
- `stripe`: real Stripe PaymentIntent + refund flow.

For Stripe mode, set:

```dotenv
PAYMENT_GATEWAY_MODE=stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_DEFAULT_PAYMENT_METHOD_ID=pm_card_visa
```

### Frontend `.env` (create if missing)

Create file at `frontend/frontend_stayease/.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:5000
VITE_PAYMENT_API_BASE_URL=http://localhost:4004
VITE_INTERNAL_SERVICE_KEY=your-strong-internal-key
VITE_FALLBACK_BEARER_TOKEN=demo-token
```

Important:
- `VITE_INTERNAL_SERVICE_KEY` must match backend `INTERNAL_SERVICE_KEY`.
- For Stripe mode, use a valid test payment method in frontend Payment page (default is `pm_card_visa`).

---

## 3. Run Backend (Recommended Flow)

Open 2 terminals in backend root.

### Terminal 1: Start mock auth service

```powershell
npm run mock:auth
```

Expected output:
- `Mock auth service running on port 4001`

### Terminal 2: Start payment backend service

```powershell
npm start
```

Expected output:
- `MongoDB connected`
- `Payment service running on port 4004`

### Verify backend health

```powershell
Invoke-WebRequest -Uri "http://localhost:4004/health" -UseBasicParsing | Select-Object -ExpandProperty Content
```

Expected output (example):

```json
{"service":"stayease-payment-service","status":"ok","timestamp":"..."}
```

---

## 4. Run Frontend

Open a new terminal in frontend root.

### Install dependencies (first time)

```powershell
npm install
```

### Start frontend dev server

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
```

Expected output:
- `Local: http://127.0.0.1:5173/`

### Open UI pages

- Home: `http://127.0.0.1:5173/`
- Payment integration page: `http://127.0.0.1:5173/payments`

From `/payments`, you can execute:
- Create payment
- Get payment status
- Refund payment
- Send internal notification
- Get notification history

---

## 5. Test End-to-End Quickly

From backend root:

```powershell
$env:PAYMENT_SERVICE_URL="http://localhost:4004"
$env:SMOKE_BEARER_TOKEN="demo-token"
$env:INTERNAL_SERVICE_KEY="your-strong-internal-key"
npm run smoke:integration
```

Expected output:
- `1) Payment created: success`
- `2) Payment fetched: success`
- `3) Internal notification: sent`
- `4) Notification history count: ...`
- `5) Refund status: refunded`
- `Smoke test completed successfully`

---

## 6. Docker Usage (Local Mongo Option)

Use this only if you want local MongoDB container instead of Atlas.

### Start MongoDB container

```powershell
docker compose up -d payment-mongodb
```

### Point backend to local MongoDB

Set backend `.env`:

```dotenv
MONGO_URI=mongodb://localhost:27017/stayease_payment_db
```

Then run backend as usual:

```powershell
npm start
```

### Stop MongoDB container

```powershell
docker compose stop payment-mongodb
```

or fully remove resources:

```powershell
docker compose down
```

---

## 7. Build Checks

### Backend checks

```powershell
npm run lint
npm test
```

### Frontend production build

```powershell
cd frontend/frontend_stayease
npm run build
```

---

## 8. Common Issues

1. Frontend shows API errors:
- Check backend is running on port 4004.
- Check frontend `.env` has `VITE_PAYMENT_API_BASE_URL=http://localhost:4004`.

2. Internal notification fails with 403:
- Ensure frontend `VITE_INTERNAL_SERVICE_KEY` equals backend `INTERNAL_SERVICE_KEY`.

3. Auth-related 401 errors:
- Ensure `npm run mock:auth` is running on port 4001.
- Ensure backend `AUTH_SERVICE_URL=http://localhost:4001`.

4. `vite is not recognized`:
- Run `npm install` inside frontend folder.

5. Docker command fails:
- Ensure Docker Desktop is open and engine is running.

6. Stripe mode fails:
- Ensure `PAYMENT_GATEWAY_MODE=stripe` and `STRIPE_SECRET_KEY` is valid.
- Ensure `paymentMethodId` is valid Stripe test value (for example: `pm_card_visa`).

---

## 9. Stop All Running Services

- Stop frontend terminal: `Ctrl + C`
- Stop backend terminal: `Ctrl + C`
- Stop mock auth terminal: `Ctrl + C`
- Stop docker mongo (if used):

```powershell
docker compose stop payment-mongodb
```
