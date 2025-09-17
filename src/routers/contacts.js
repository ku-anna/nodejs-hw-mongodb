import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
} from '../controllers/contacts.controller.js';

const router = Router();

// GET all contacts
router.get('/', getContactsController);

// GET contact by id
router.get('/:contactId', getContactByIdController);

export default router;
