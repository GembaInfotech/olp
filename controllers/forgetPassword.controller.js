
const {forgotPassword} = require('../handlers/passwordHandler/forgetPassword')
const {resetPasswordRedirect} = require("../handlers/passwordHandler/resetPasswordRedirect")
const {resetPassword} = require('../handlers/passwordHandler/resetPassword')
exports.forget_password = async (req, res) => {
  try {
    await forgotPassword(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.reset_password_redirect = async (req, res) => {
  try {
    console.log("resetpassword....1")
    await resetPasswordRedirect(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.reset_password = async (req, res) => {
  try {
    await resetPassword(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



