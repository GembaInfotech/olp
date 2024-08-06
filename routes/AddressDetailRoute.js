'use strict';
const router = require("express").Router();


  const addressController = require("../controllers/address.controller")

  router.route('/city/:state').get(addressController.getCity);
  router.route('/state').get(addressController.getState);

  

  module.exports =router