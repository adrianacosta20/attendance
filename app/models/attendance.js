var mongoose = require('mongoose'); 
var attendanceSchema = mongoose.Schema({
  sid: String,
  date: Date,
  signature: String,
  
}); 
module.exports = mongoose.model('Attendance', attendanceSchema);