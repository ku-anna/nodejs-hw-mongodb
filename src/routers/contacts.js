import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
} from '../controllers/contacts.controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

// GET all contacts
router.get('/', ctrlWrapper(getContactsController));

// GET contact by id
router.get('/:contactId', ctrlWrapper(getContactByIdController));

export default router;
