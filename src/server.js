// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(
    pino({
      transport: { target: 'pino-pretty' },
    }),
  );

  app.get('/', (_req, res) => {
    res.json({ status: 200, message: 'API up' });
  });

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
