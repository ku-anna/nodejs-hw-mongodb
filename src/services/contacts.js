import { ContactsCollection } from '../models/contacts.js';
import { SORT_ORDER } from '../constants/index.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UsersCollection } from '../models/user.js';

const SALT_ROUNDS = 10;

export const registerUser = async ({ name, email, password }) => {
  const existing = await UsersCollection.findOne({ email });
  if (existing) {
    throw createHttpError(409, 'Email in use');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await UsersCollection.create({
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

// get all + pagination + filtering + sorting
export const getAllContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  type,
  isFavourite,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId });

  if (type) {
    contactsQuery.where('contactType').equals(type);
  }

  if (typeof isFavourite !== 'undefined') {
    const fav = isFavourite === 'true' || isFavourite === true;
    contactsQuery.where('isFavourite').equals(fav);
  }

  const contactsCount = await ContactsCollection.find({ userId })
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

//gET by id
export const getContactById = async (userId, contactId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });

  if (!contact) {
    return null;
  }

  return {
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  };
};

//create
export const createContact = async (payload) => {
  return await ContactsCollection.create(payload);

  // return {
  //   status: 201,
  //   message: 'Successfully created a contact!',
  //   data: newContact,
  // };
};

// upsert
export const updateContact = async (userId, contactId, payload) => {
  return await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true },
  );
};

//delete
export const deleteContact = async (userId, contactId) => {
  const deletedContact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return deletedContact;
};
