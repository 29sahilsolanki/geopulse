import joi from "joi";

const registerValidations = joi.object({
  name: joi.string().min(3).max(20).required(),
  email: joi.string().email().required(),
  phone: joi.string().length(10).required(),
  department: joi.string().min(3).max(20).required(),
  password: joi.string().min(4).max(20).required(),
});

export { registerValidations };
