import { model, Schema } from 'mongoose';

const Contacts = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      required: true,
      enum: ['home', 'personal', 'work'],
      default: 'personal',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const ContactsCollection = model('contacts', Contacts);
export default ContactsCollection;
