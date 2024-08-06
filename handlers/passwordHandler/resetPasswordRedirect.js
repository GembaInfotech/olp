const forgetPassword = require("../../models/forgetPassword.model");
const log = require('../../middlewares/utils/log');
const response = require("../../middlewares/utils/responseHandle");

exports.resetPasswordRedirect = async (req, res) => {
    try {
        console.log("resetpassword...2")
        let forgotToken = req.params.token; 
        console.log(forgotToken);

        const data = await forgetPassword.findOne({
            token: { $eq: forgotToken },
          });
        console.log("data", data);

        if (!data || data.verified === "1") {
            console.log("data", data);
            log.dev("Wrong password reset link!", "");
            return response.throw(
                201,
                "This link has been expired or is incorrect!",
                "",
                res
            );
        } else {
            log.dev("Link verified", "");
            return response.throw(200, "Link verified", "", res);
        }
    } catch (err) {
        log.test("Something went wrong with reset_verify-- ", err);
        return response.throw(201, "Something went wrong, please try again!", "", res);
    }
};
