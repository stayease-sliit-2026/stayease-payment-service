# Payment Service Integration Proof

Date: 2026-03-21
Service: stayease-payment-service
Scope: Local end-to-end smoke verification with Mock Auth + MongoDB

## Environment used

- Payment service URL: http://localhost:4004
- Mock Auth URL: http://localhost:4001
- MongoDB: docker compose service payment-mongodb
- Internal service key: configured via environment variable

## Command executed

```bash
npm run smoke:integration
```

## Actual smoke output

```text
1) Payment created: success
2) Payment fetched: success
3) Internal notification: sent
4) Notification history count: 2
5) Refund status: refunded
Smoke test completed successfully
```

## Verified integration checkpoints

- Auth verification path works through Payment -> Auth (/auth/verify).
- Payment create endpoint is functional and persists records.
- Payment status lookup by bookingId is functional.
- Internal notification route accepts valid service key and stores message.
- Notification history endpoint returns stored records.
- Refund flow updates payment status to refunded.

## Assessment mapping evidence

- Practicality & Functionality: Core endpoints executed in sequence successfully.
- Inter-service Communication: Payment consumed Auth verify and internal notification flow.
- Security: Bearer and internal service key checks enforced in flow.
- Code Quality: Smoke and automated tests pass with strict lint gate.

## Screenshots to capture for final report/demo

- Terminal output showing smoke success.
- Running service logs for payment creation and refund.
- Postman request/response for each major endpoint.
- Docker container running state for payment-mongodb.
