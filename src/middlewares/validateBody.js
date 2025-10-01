// src/middlewares/validateBody.js

import createHttpError from 'http-errors';

export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next(
      createHttpError(400, error.details.map((d) => d.message).join('; ')),
    );
  }

  req.body = value;
  next();
};
