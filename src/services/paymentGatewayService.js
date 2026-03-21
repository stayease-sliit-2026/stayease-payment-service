const crypto = require('crypto');
const Stripe = require('stripe');

function getGatewayMode() {
  return (process.env.PAYMENT_GATEWAY_MODE || 'mock').toLowerCase();
}

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  return new Stripe(secretKey);
}

function buildMockTransactionId() {
  return `TXN-${crypto.randomUUID()}`;
}

function resolveMockStatus() {
  return Math.random() < 0.9 ? 'success' : 'failed';
}

async function createGatewayPayment(payload) {
  const mode = getGatewayMode();

  if (mode !== 'stripe') {
    return {
      status: resolveMockStatus(),
      transactionId: buildMockTransactionId(),
      provider: 'mock',
    };
  }

  const stripe = getStripeClient();
  if (!stripe) {
    throw new Error('PAYMENT_GATEWAY_MODE is stripe but STRIPE_SECRET_KEY is missing');
  }

  const paymentMethod =
    payload.paymentMethodId ||
    process.env.STRIPE_DEFAULT_PAYMENT_METHOD_ID ||
    'pm_card_visa';

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(Number(payload.amount) * 100),
    currency: String(payload.currency || 'lkr').toLowerCase(),
    payment_method_types: ['card'],
    payment_method: paymentMethod,
    confirm: true,
    metadata: {
      bookingId: String(payload.bookingId || ''),
      userId: String(payload.userId || ''),
    },
  });

  return {
    status: intent.status === 'succeeded' ? 'success' : 'failed',
    transactionId: intent.id,
    provider: 'stripe',
    rawStatus: intent.status,
  };
}

async function refundGatewayPayment(transactionId) {
  const mode = getGatewayMode();
  if (mode !== 'stripe') {
    return { refunded: true, provider: 'mock' };
  }

  const stripe = getStripeClient();
  if (!stripe) {
    throw new Error('PAYMENT_GATEWAY_MODE is stripe but STRIPE_SECRET_KEY is missing');
  }

  await stripe.refunds.create({ payment_intent: transactionId });
  return { refunded: true, provider: 'stripe' };
}

module.exports = {
  createGatewayPayment,
  refundGatewayPayment,
};
