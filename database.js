module.exports = function(){
    var mongoose = require('mongoose');
    var mongo = mongoose.connect('mongodb://localhost/attendance');
    return mongo;                
}