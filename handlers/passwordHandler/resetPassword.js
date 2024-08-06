const ForgetPassword = require("../../models/forgetPassword.model");
const User = require('../../models/user.model');
const log = require('../../middlewares/utils/log');
const response = require('../../middlewares/utils/responseHandle')
const bcrypt = require('bcrypt');

function validatePW(str) {
    if (str.length <= 5) return false;
    if (!/[A-Z]/.test(str)) return false;
    if (!/[a-z]/.test(str)) return false;
    return true;
}

exports.resetPassword = async (req, res) => {
    console.log("hello");
    let forgotToken = req.body.token; 
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
        return response.throw(202, "Passwords do not match!", "", res);
    }

    if (!validatePW(password)) {
        return response.throw(500, "Invalid: Password doesn't meet the requirements", "", res);
    }

    try {
        const data = await ForgetPassword.findOne({ token: forgotToken });
        if (!data) {
            return response.throw(201, "Please check password reset link", "", res);
        }

        const user = await User.findOne({ email: data.email });
        if (!user) {
            return response.throw(201, "User not found", "", res);
        }

        const saltRounds = 10;
        const hash = bcrypt.hashSync(password, saltRounds);
        await User.updateOne({ email: data.email }, { password: hash });
        await ForgetPassword.updateOne({ token: forgotToken }, { verified: "1" });

        return response.throw(200, "Password reset successfully!", "", res);

    } catch (err) {
        log.test("Something went wrong with reset_password", err);
        return response.throw(201, "Something went wrong, please try again", "", res);
    }
};
