// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var teachersSchema = mongoose.Schema({
  email: { type: String, lowercase: true, trim: true },
  password: String,
  name: { type: String, trim: true },
  emailConfirmed: {type: Boolean, default: false},
  emailConfirmationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Number,
  courses:[{
    code: String,
    description: String
  }]
});

// generating a hash
teachersSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };
  
  // checking if password is valid
  teachersSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  
  // checking email confirmation
  teachersSchema.methods.isEmailConfirmed = function () {
    return this.emailConfirmed;
  };
  
  // create the model and expose it to our app
  module.exports = mongoose.model('Teacher', teachersSchema);