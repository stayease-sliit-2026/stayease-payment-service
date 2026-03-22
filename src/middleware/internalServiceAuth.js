const { verifyUserToken } = require('../services/authService');

function requireInternalServiceKey(req, res, next) {
  const expectedKey = process.env.INTERNAL_SERVICE_KEY;
  const providedKey = req.headers['x-internal-service-key'];

  if (expectedKey && providedKey && providedKey === expectedKey) {
    return next();
  }

  return verifyBearerAsService(req, res, next, expectedKey, providedKey);
}

async function verifyBearerAsService(req, res, next, expectedKey, providedKey) {
  const authHeader = req.headers.authorization || '';

  if (authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.replace('Bearer ', '').trim();
      const verifiedUser = await verifyUserToken(token);

      if (verifiedUser?.userId) {
        req.user = verifiedUser;
        return next();
      }
    } catch (_error) {
      return res.status(401).json({ success: false, message: 'Authentication failed' });
    }
  }

  if (!expectedKey) {
    return res.status(500).json({ success: false, message: 'Internal service key is not configured' });
  }

  if (providedKey) {
    return res.status(403).json({ success: false, message: 'Forbidden internal route access' });
  }

  return res.status(401).json({ success: false, message: 'Missing internal service key or bearer token' });
}

module.exports = {
  requireInternalServiceKey,
};
