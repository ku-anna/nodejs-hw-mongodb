import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import 'dotenv/config';

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();
