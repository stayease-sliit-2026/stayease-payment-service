require('dotenv').config();
const app = require('./app');
const { connectDatabase } = require('./config/db');

const PORT = Number(process.env.PORT || 4004);

async function bootstrap() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Payment service running on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start service:', error.message);
  process.exit(1);
});
