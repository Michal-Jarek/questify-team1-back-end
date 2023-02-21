const Joi = require("joi");

const schema = Joi.object({
  title: Joi.string().required(),
  difficulty: Joi.string().valid("easy", "normal", "hard").required(),
  date: Joi.string()
    .pattern(new RegExp("[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])"))
    .message("Invalid 'date'. Please, use YYYY-MM-DD string format")
    .required(),
  time: Joi.string()
    .pattern(new RegExp("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"))
    .message("Invalid 'time'. Please, use HH:MM string format")
    .required(),
  category: Joi.string()
    .valid("stuff", "family", "health", "learning", "leisure", "work")
    .required(),
  type: Joi.string().valid("task", "challenge").required(),
});

const validateData = (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  req.body = value;
  next();
};

const schemaToEditCard = Joi.object({
  title: Joi.string(),
  difficulty: Joi.string().valid("easy", "normal", "hard"),
  date: Joi.string()
    .pattern(new RegExp("[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])"))
    .message("Invalid 'date'. Please, use YYYY-MM-DD string format"),
  time: Joi.string()
    .pattern(new RegExp("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"))
    .message("Invalid 'time'. Please, use HH:MM string format"),
  category: Joi.string().valid(
    "stuff",
    "family",
    "health",
    "learning",
    "leisure",
    "work"
  ),
  type: Joi.string().valid("task", "challenge"),
});

const validateDataForEditing = (req, res, next) => {
  const { error, value } = schemaToEditCard.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  req.body = value;
  next();
};

module.exports = { validateData, validateDataForEditing };
