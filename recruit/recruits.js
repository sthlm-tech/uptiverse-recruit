var Recruit = require("./Recruit");
var helpers = require("./helpers");
const url = require('url');
var when = require('when');
function RecruitService() {
	var self = this;

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
		Recruit.find(query, function(err,recruits){
			deferred.resolve(recruits);
		});

		return deferred.promise;
	};

	self.find = function(searchString){
		var urlobj = url.parse(searchString);
		var connection = helpers.getFromSupportedConnection(urlobj.host);
		if(connection){
			return self.getByExternalLinks(connection, urlobj);
		}else{
			return self.getByName(searchString);
		}
	};


	self.getByName = function(name){
		var deferred = when.defer();
		var nameLower = name.toLowerCase();
		Recruit.find({searchableName: { "$regex": nameLower, "$options": "i" }}, function(err, recruits) {
			deferred.resolve({
				source: 'name',
				recruits: recruits,
			});
		});
		return deferred.promise;
	};


	self.getByExternalLinks = function(connection, urlobj){
		var deferred = when.defer();
			var id = connection.getIdFromPath(urlobj.pathname);

			self.getByConnectionId(connection.idPath, id)
			.then(function(recruits){
				if(recruits){
						deferred.resolve({
							id: id,
							source: connection.id,
							recruits: recruits,
						});
				}else{
					deferred.resolve({
						id: id,
						source: urlobj.host,
						recruits: [],
					});
				}
			});

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
