const Joi = require("joi");

const userValidationMiddleware = async (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string().optional(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (validationError) {
    res.status(400).json({ error: validationError.details[0].message });
  }
};

module.exports = userValidationMiddleware;
