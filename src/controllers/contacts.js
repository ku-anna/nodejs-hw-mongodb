import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

// GET - all contacts
export const getContactsController = async (req, res) => {
  const result = await getAllContacts();
  res.status(result.status).json(result);
};

// GET by id
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const result = await getContactById(contactId);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(result.status).json(result);
};

// PUT controller
export const createContactController = async (req, res) => {
  const { name, phoneNumber, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createHttpError(400, 'Missing required fields');
  }

  const result = await createContact(req.body);
  res.status(result.status).json(result);
};

// PATCH controller
export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(result.status).json(result);
};

// DELETE controller
export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await deleteContact(contactId);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};

//upsert
export const upsertContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const result = await updateContact(contactId, req.body, {
      upsert: true,
    });

    if (!result) {
      return next(createHttpError(404, 'Contact not found'));
    }

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
      status,
      message: result.isNew
        ? 'Successfully created a new contact!'
        : 'Successfully updated the contact!',
      data: result.contact,
    });
  } catch (err) {
    next(err);
  }
};
