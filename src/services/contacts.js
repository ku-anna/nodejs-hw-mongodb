import { ContactsCollection } from '../models/contacts.js';
import { SORT_ORDER } from '../constants/index.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/User.js';

const SALT_ROUNDS = 10;

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw createHttpError(409, 'Email in use');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };
};

// GET all + pagination + sorting + filters
export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  type,
  isFavourite,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();

  if (type) {
    contactsQuery.where('contactType').equals(type);
  }

  if (typeof isFavourite !== 'undefined') {
    const fav = isFavourite === 'true' || isFavourite === true;
    contactsQuery.where('isFavourite').equals(fav);
  }

  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const totalPages = Math.ceil(contactsCount / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems: contactsCount,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

// GET by id
export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);

  if (!contact) {
    return null;
  }

  return {
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  };
};

//PUT

export const createContact = async (payload) => {
  const newContact = await ContactsCollection.create(payload);

  return {
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  };
};

// update/insert
export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

// DELETE

export const deleteContact = async (contactId) => {
  const deletedContact = await ContactsCollection.findByIdAndDelete(contactId);

  if (!deletedContact) {
    return null;
  }

  return true;
};
