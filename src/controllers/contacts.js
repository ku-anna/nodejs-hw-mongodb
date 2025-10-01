import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { registerUser } from '../services/auth.js';

//GET all + pagination
export const getContactsController = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = '_id',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const result = await getAllContacts({
    page: Number(page),
    perPage: Number(perPage),
    sortBy,
    sortOrder: sortOrder.toLowerCase() === 'desc' ? -1 : 1,
    type,
    isFavourite,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
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

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
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

// Register user
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};
