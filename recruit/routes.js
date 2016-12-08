var App = require("./../core/core");
var recruits = require("./recruits")	;

var baseUrl = "/recruits"
module.exports = function() {

	App.Express.get( baseUrl, function (req, res) {
			recruits.getAll()
			.then(function(response) {
				res.send(response);
			});
	});

	App.Express.get( baseUrl + "/:id", function (req, res) {
			recruits.getById(req.params.id)
			.then(function(response) {
				res.send(response);
			});
	});

	App.Express.post( baseUrl + "/find", function (req, res) {
			recruits.getByExternalLinks(req.body.link)
			.then(function(response) {
				res.send(response);
			});
	});

	App.Express.post( baseUrl + "/create", function (req, res) {
			recruits.create(req.body.recruit)
			.then(function(response) {
				res.send(response);
			});
	});

};
