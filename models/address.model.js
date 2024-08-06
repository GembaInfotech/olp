const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  state: {
    type: String,
    
  },
  city:[{
    type:String
}]
 
});

module.exports = mongoose.model("Address", addressSchema);
