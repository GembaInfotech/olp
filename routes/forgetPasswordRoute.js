'use strict';
const router = require("express").Router();

const forgetPasswordController = require('../controllers/forgetPassword.controller')

router.route('/forgot-password').post(forgetPasswordController.forget_password);
router.route('/reset-password/:token').post(forgetPasswordController.reset_password_redirect);
router.route('/reset-password').post(forgetPasswordController.reset_password);





module.exports =router