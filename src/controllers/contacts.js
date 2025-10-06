import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

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

  const userId = req.user._id;

  const result = await getAllContacts({
    userId,
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

  const contactData = {
    ...req.body,
    userId: req.user._id,
  };

  const contact = await createContact(contactData);

  res.status(201).json({
    status: 201,
    message: 'Contact created successfully',
    data: contact,
  });
};

// PATCH controller
export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const payload = req.body;

  const updatedContact = await updateContact(userId, contactId, payload);
  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

// DELETE controller
export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const deleted = await deleteContact({ userId, contactId });

  if (!deleted) {
    throw createHttpError(404, `Contact with id ${contactId} does not exist`);
  }

  res.sendStatus(204);
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
