const express = require('express');

const app = express();
const port = Number(process.env.MOCK_AUTH_PORT || 4001);

app.get('/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing bearer token' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  return res.status(200).json({
    userId: 'USR1001',
    role: 'guest',
    source: 'mock-auth-service',
  });
});

app.listen(port, () => {
  console.log(`Mock auth service running on port ${port}`);
});
