const mongoose = require('mongoose'); 

const internshipSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})

const intershipModel = mongoose.model("internships", internshipSchema);
module.exports = intershipModel;
