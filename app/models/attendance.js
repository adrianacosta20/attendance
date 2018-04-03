
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var attendanceSchema = mongoose.Schema({
  sid: String,
  date: Date,
  signature: String,
  
});

// create the model and expose it to our app
module.exports = mongoose.model('Attendance', attendanceSchema);