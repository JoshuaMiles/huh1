var tanda = require("tanda");

tanda.init("ab0bba0784bc21aaea8dc862c7531316d681954f07d8ce5398589fd46b23f396", "79d5af6eda31cb589fb1e67a827fb6176bd13990f0e516c5689066cc06020958");

var auth_options = {
  redirect : : "my.tanda.co"),
  scope : "roster",
  scopes : ),
}

tanda.auth.init(auth_options);



function staffMember(id) {
	this.userID = id;
	this.from = 0;
	this.to = 0;
	this.lat = 0;
	this.long = 0;
}



// How to get the user id to start with
var employee = new staffMember(id);

// Returns the String of the tweet to be tweeted
var theTweet = function informativeTweet() {
	var tweetString;
	return tweetString = "Employee " + employee.userID + " you have work from " + employee.from + " to " + employee.to + " at " + employee.lat + ", " + employee.long + " #huhApp";
}

module.exports = theTweet;