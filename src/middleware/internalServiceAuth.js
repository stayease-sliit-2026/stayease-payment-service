function requireInternalServiceKey(req, res, next) {
  const expectedKey = process.env.INTERNAL_SERVICE_KEY;

  if (!expectedKey) {
    return res.status(500).json({ success: false, message: 'Internal service key is not configured' });
  }

  const providedKey = req.headers['x-internal-service-key'];

  if (!providedKey || providedKey !== expectedKey) {
    return res.status(403).json({ success: false, message: 'Forbidden internal route access' });
  }

  return next();
}

module.exports = {
  requireInternalServiceKey,
};
