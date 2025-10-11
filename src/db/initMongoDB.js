import { getEnvVar } from '../utils/getEnvVar.js';
import mongoose from 'mongoose';

export const initMongoDB = async () => {
  const user = getEnvVar('MONGODB_USER');
  const pwd = getEnvVar('MONGODB_PASSWORD');
  const url = getEnvVar('MONGODB_URL');
  const db = getEnvVar('MONGODB_DB');

  const connectionString = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(connectionString);
    console.log('MongoDB connection successful.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};
