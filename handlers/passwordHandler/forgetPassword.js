const forgetPassword =  require("../../models/forgetPassword.model")
const User = require('../../models/user.model')
const nodemailer = require("../../middlewares/utils/nodemailer")
const crypto = require("crypto")
const log = require('../../middlewares/utils/log')
const response = require("../../middlewares/utils/responseHandle")
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        
        const user = await User.findOne({
            email: { $eq: email },
          });
        
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
        const forgetToken = crypto.randomBytes(20).toString('hex');
        await forgetPassword.create({ userId: user._id, email: email, token: forgetToken, verified: '0' });
        const resetUrl = "http://ec2-13-53-42-37.eu-north-1.compute.amazonaws.com:4005/#/reset-password/" + forgetToken + "/";
        const Data = {
            email: email,
            link: resetUrl
        }
        console.log("link", Data.link);
        try {
            await nodemailer.transporterForResetPass(Data)
                .then(async () => {
                    log.dev("Password reset link has been sent to your email id");
                    return response.throw(200, "Password reset link has been sent to your email id", user, res)
                })
        } catch (error) {
            log.dev(error);
            return response.throw(202, "Something went please try again!", error, res)

        }
    } catch (error) {
        console.error('Error initiating password reset:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
}



