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

		Recruit.findOne({"_id" : id}, function(err, recruit){
			deferred.resolve(recruit);
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

	self.save = function(in_user_data){
		var deferred = when.defer();

		if(!in_user_data._id){
			self.create(in_user_data)
			.then(function(createdRecruit){
				deferred.resolve(createdRecruit);
			});
		}
		else{
			self.getById(in_user_data._id)
			.then(function(recruit){
				updateRecruit(recruit, in_user_data);
				recruit.save(function(err, updatedRecruit){
					deferred.resolve(updatedRecruit);
				});
			});
		}

		return deferred.promise;
	};

	self.create = function(in_user_data){
		var deferred = when.defer();
		var recruit = new Recruit();

		updateRecruit(recruit, in_user_data);
		recruit.connections[in_user_data.connection] = in_user_data.id;
		recruit.addedBy = in_user_data.addedBy; //TODO: change this to be fetched from JWT token
		recruit.added = new Date();

		recruit.save(function(err, createdRecruit){
			deferred.resolve(createdRecruit);
		});

		return deferred.promise;
	}

}

function updateRecruit(recruit, data){
	recruit.firstname = data.firstname,
	recruit.lastname = data.lastname,
	recruit.searchableName = (data.firstname + " " + data.lastname).toLowerCase();
	recruit.connections = data.connections;

	return recruit;
}
module.exports = new RecruitService();
