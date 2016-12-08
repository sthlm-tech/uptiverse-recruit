var config = require("./../config");
var mongoose = require('mongoose');
var Recruit = require("./Recruit");
var helpers = require("./helpers");
const url = require('url');
var when = require('when');
function RecruitService() {
	var self = this;

	mongoose.connect(config.db_connectionString);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
	  // we're connected!
	});

	self.getAll = function(){
		var deferred = when.defer();

		Recruit.find(function(err, users) {
			deferred.resolve(users);
	  });

		return deferred.promise;
	};

	self.getById = function(id){
		var deferred = when.defer();

		Recruit.findOne({"_id" : id}, function(err,user){
			deferred.resolve(user);
		});

		return deferred.promise;
	};

	self.getByConnectionId = function(identifier,id){
		var deferred = when.defer();

		var query = {};
		query[identifier] = id;
		Recruit.findOne(query, function(err,recruit){
			deferred.resolve(recruit);
		});

		return deferred.promise;
	};

	self.getByExternalLinks = function(link){
		var deferred = when.defer();
		var urlobj = url.parse(link);
		var connection = helpers.getFromSupportedConnection(urlobj.host);

		if(connection){
			var id = connection.getIdFromPath(urlobj.pathname);

			self.getByConnectionId(connection.idPath, id)
			.then(function(recruit){
				if(recruit){
						deferred.resolve({
							result:"FOUND_EXACT_MATCH",
							id: id,
							source: connection.id,
							recruit: recruit,
						});
				}else{
					deferred.resolve({
						result:"NOT_FOUND",
						id: id,
						source: urlobj.host,
					});
				}
			});

		}
		else{
			deferred.resolve({
				result:"LINK_NOT_SUPPORTED",
			});
		}

		return deferred.promise;
	};

	self.create = function(in_user_data){
		var deferred = when.defer();
		var recruit = new Recruit();

		recruit.firstname = in_user_data.firstname,
		recruit.lastname = in_user_data.lastname,
		recruit.connections[in_user_data.connection] = in_user_data.id;

		recruit.save(function(err, createdRecruit){
			deferred.resolve(createdRecruit);
		});

		return deferred.promise;
	}

}
module.exports = new RecruitService();
