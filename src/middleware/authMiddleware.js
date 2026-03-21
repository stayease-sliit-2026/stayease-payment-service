const { verifyUserToken } = require('../services/authService');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Missing or invalid bearer token' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const verifiedUser = await verifyUserToken(token);

    if (!verifiedUser.userId) {
      return res.status(401).json({ success: false, message: 'Unable to verify user identity' });
    }

    req.user = verifiedUser;
    return next();
  } catch (_error) {
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
}

module.exports = {
  requireAuth,
};
