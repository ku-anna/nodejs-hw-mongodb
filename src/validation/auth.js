import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
