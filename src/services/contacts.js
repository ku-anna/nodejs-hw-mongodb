import { ContactsCollection } from '../models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();

  return {
    status: 200,
    message: 'Successfully found contacts!',
    contacts,
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
    contact,
  };
};
