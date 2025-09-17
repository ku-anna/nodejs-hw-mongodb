import { getAllContacts, getContactById } from '../services/contacts.js';
import createHttpError from 'http-errors';

// controller - all contacts
export const getContactsController = async (req, res) => {
  const result = await getAllContacts();
  res.status(result.status).json(result);
};

// controller - contact by id
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const result = await getContactById(contactId);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(result.status).json(result);
};
