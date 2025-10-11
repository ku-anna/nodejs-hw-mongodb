import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

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
export const createContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
      throw createHttpError(400, 'Missing required fields');
    }

    const contactData = {
      ...req.body,
      userId: req.user._id,
    };

    const photo = req.file;
    if (photo) {
      let photoUrl;
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }

      contactData.photo = photoUrl;
    }

    const contact = await createContact(contactData);

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH controller
export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateContact(userId, contactId, {
    ...req.body,
    ...(photoUrl && { photo: photoUrl }),
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
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
