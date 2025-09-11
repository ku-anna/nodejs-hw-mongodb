// src/db/initMongoDB.js

export const initMongoDB = async () => {
  try {
    console.log("Mongo connection successfully established!");
  } catch (e) {
    console.log("Error while setting up mongo connection", e);
    throw e;
  }
};
