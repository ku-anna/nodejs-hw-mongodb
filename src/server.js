// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getAllContacts, getContactById } from './services/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  //contacts
  app.get('/contacts', async (req, res) => {
    const result = await getAllContacts();
    res.status(result.status).json(result);
  });

  // contactId
  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const result = await getContactById(contactId);

    if (!result) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    res.status(result.status).json(result);
  });

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

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
