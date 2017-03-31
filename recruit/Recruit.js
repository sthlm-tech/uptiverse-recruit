var mongoose = require('mongoose');

var recruitSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    searchableName: String,
    connections: {
      linkedIn: String,
      facebook: String
    },
    createdBy: Object,
    created: Date

});

var Recruit = mongoose.model('Recruit', recruitSchema);

module.exports = Recruit;
