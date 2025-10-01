import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
  upsertContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);

// GET all contacts
router.get('/', ctrlWrapper(getContactsController));

// GET contact by id
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

// POST
router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

// PUT (upsert)
router.put(
  '/:contactId',
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController),
);

// PATCH
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

// DELETE
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
