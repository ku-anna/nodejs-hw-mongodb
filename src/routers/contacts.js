import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

// GET all contacts
router.get('/', ctrlWrapper(getContactsController));

// GET contact by id
router.get('/:contactId', ctrlWrapper(getContactByIdController));

//PUT
router.post('/', ctrlWrapper(createContactController));

// PATCH
router.patch('/:contactId', ctrlWrapper(updateContactController));

// DELETE
router.delete('/:contactId', ctrlWrapper(deleteContactController));
export default router;
