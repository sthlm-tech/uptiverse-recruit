var mongoose = require('mongoose');

var recruitSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    connections: {
      linkedIn: String,
      facebook: String
    }
});

var Recruit = mongoose.model('Recruit', recruitSchema);

module.exports = Recruit;
