var App = require("ms-core");
var recruits = require("./recruits");

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

	App.Express.post( baseUrl + "/save", function (req, res) {
			recruits.save(req.body.recruit)
			.then(function(response) {
				res.send(response);
			});
	});

	App.Express.post( baseUrl + "/find", function (req, res) {
			recruits.find(req.body.link)
			.then(function(response) {
				res.send(response);
			});
	});

	App.Express.get( baseUrl + "/search/:query", function (req, res) {
			recruits.find(req.params.query)
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
