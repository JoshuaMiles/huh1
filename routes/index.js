var express = require('express');
var router = express.Router();
const request = require('request');

var accessToken = '326d8592e1e4a3c738268f5d9c91716fae2f697c5aba4f0c53977f6662ce7d08';

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	// Do the logic needed
	// Can pass in JSON objects into here
	// Payload is what you call in the Handlebars
	// res.render('index', {payload:something});

	//TODO can you have multiple renders
	tandlerUser().then(
			function(tandaUsers){
				var usersJSONObj = JSON.parse(tandaUsers.body);
				console.log(usersJSONObj);
				res.render('index', {employee:usersJSONObj});
			}
	).catch(function (err) {
		console.error("There was an error when trying to complete your request: " + err);
	});


	var something = "no";
	// Promise.new( nameFunctionThing )
	// .then((data) => res.render('index', data))
	// .catch(err => res.render('error'));
	// Look for status and set timeout

});

function tandlerUser() {
	return new Promise(function (resolve, reject) {
		request({
			url: 'https://my.tanda.co/api/v2/users/',
			auth: {
				'bearer': accessToken
			}
		}, function (err, res) {
			if (err) reject(err);
			else resolve(res);
		});
	});
}


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;