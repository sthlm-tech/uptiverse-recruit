var config = require("./config");
var mongoose = require('mongoose');

mongoose.connect(config.db_connectionString, {useMongoClient: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
