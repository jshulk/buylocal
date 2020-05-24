import Joi, { Schema } from "@hapi/joi";
export const createUserSchema: Schema = Joi.object({
  email: Joi.string().email().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string(),
  password: Joi.string().required(),
  confirm_password: Joi.string().required().valid(Joi.ref("password")),
});

export const updateUserSchema: Schema = Joi.object({
  id: Joi.number().required(),
});

export const updateUserPayloadSchema: Schema = Joi.object({
  email: Joi.string().email(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  password: Joi.string(),
});
