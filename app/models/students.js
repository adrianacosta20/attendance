var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var studentsSchema = mongoose.Schema({
  email: { type: String, lowercase: true, trim: true },
  password: String,
  name: { type: String, trim: true },
  emailConfirmed: {type: Boolean, default: false},
  emailConfirmationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Number
});
 
studentsSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };
   
  studentsSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
   
  studentsSchema.methods.isEmailConfirmed = function () {
    return this.emailConfirmed;
  };
   
  module.exports = mongoose.model('Students', studentsSchema);