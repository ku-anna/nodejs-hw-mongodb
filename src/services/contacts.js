import { ContactsCollection } from '../models/contacts.js';
import { SORT_ORDER } from '../constants/index.js';

// GET all + pagination + sorting
export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) => {
  const skip = (page - 1) * perPage;

  const [contacts, totalItems] = await Promise.all([
    ContactsCollection.find()
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
    ContactsCollection.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
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
