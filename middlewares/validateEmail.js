const { HttpError } = require("../helpers");

const { verificationEmail } = require("../validators")

const validateEmail = () => {
  const func = async (req, res, next) => {
    console.log(req.body);
    try {
    await verificationEmail.validateAsync(req.body)
      next();
    } catch (error) {
      next(HttpError(400, error.message));
    }
  };

  return func;
};

module.exports = validateEmail;