const axios = require('axios');

async function verifyUserToken(token) {
  const authServiceUrl = process.env.AUTH_SERVICE_URL;

  if (!authServiceUrl) {
    throw new Error('AUTH_SERVICE_URL is not configured');
  }

  const response = await axios.get(`${authServiceUrl}/auth/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 5000,
  });

  const responseData = response.data || {};

  return {
    userId: responseData.userId || responseData.id || responseData.user?.id,
    role: responseData.role || responseData.user?.role || 'guest',
    raw: responseData,
  };
}

module.exports = {
  verifyUserToken,
};
