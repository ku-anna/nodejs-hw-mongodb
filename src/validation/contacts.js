import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': `"name" should be a type of 'text'`,
    'string.empty': `"name" cannot be empty`,
    'string.min': `"name" should have at least {#limit} characters`,
    'string.max': `"name" should have at most {#limit} characters`,
    'any.required': `"name" is a required field`,
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.pattern.base': `"phoneNumber" must be a valid phone number`,
      'string.min': `"phoneNumber" should have at least {#limit} characters`,
      'string.max': `"phoneNumber" should have at most {#limit} characters`,
      'any.required': `"phoneNumber" is required`,
    }),
  email: Joi.string().email().min(3).max(20).optional().messages({
    'string.email': `"email" must be a valid email`,
    'string.min': `"email" should have at least {#limit} characters`,
    'string.max': `"email" should have at most {#limit} characters`,
  }),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string()
    .valid('home', 'personal', 'work')
    .min(3)
    .max(20)
    .required()
    .messages({
      'any.required': `"contactType" is required`,
      'any.only': `"contactType" must be one of [home, personal, work]`,
    }),
});

// contact update schema
export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .min(3)
    .max(20),
  email: Joi.string().email().min(3).max(30),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('home', 'personal', 'work').min(3).max(20),
}).min(1);

const dataToValidate = {
  name: 'John Doe',
  phoneNumber: '+380931234567',
  email: 'john.doe@example.com',
  isFavourite: true,
  contactType: 'work',
};

const validationResult = createContactSchema.validate(dataToValidate, {
  abortEarly: false,
});

if (validationResult.error) {
  console.error(
    validationResult.error.details.map((err) => err.message).join(', '),
  );
} else {
  console.log('Data is valid!');
}
