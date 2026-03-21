const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json({
    service: 'stayease-payment-service',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
