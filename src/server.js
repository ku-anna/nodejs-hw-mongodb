// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import contactsRouter from './routes/contacts.routes.js';
import { getEnvVar } from './utils/getEnvVar.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use('/contacts', contactsRouter);

  // logging
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  //404
  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
  //error
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
