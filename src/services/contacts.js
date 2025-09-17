import { ContactsCollection } from '../models/contacts.js';

export const getAllContacts = async () => {
  const data = await ContactsCollection.find();

  return {
    status: 200,
    message: 'Successfully found contacts!',
    data,
  };
};

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

// PATCH

export const updateContact = async (contactId, payload) => {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    { new: true },
  );

  if (!updatedContact) {
    return null;
  }

  return {
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
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
