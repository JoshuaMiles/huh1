var google = require('googleapis');


var OAuth2 = google.auth.OAuth2;
 
var oauth2Client = new OAuth2("824085167222-ic0guu7367oh4gtvlq49a1sgqf6ejbhn.apps.googleusercontent.com"
, "aDBPTwlaXjutRGpa9l0MepXK", "https://console.developers.google.com/apis/credentials/oauthclient/824085167222-ic0guu7367oh4gtvlq49a1sgqf6ejbhn.apps.googleusercontent.com?project=824085167222");
 
// generate a url that asks permissions for Google Calendar scopes 
var scopes = [	
  'https://www.googleapis.com/auth/calendar'
];

var url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token) 
  scope: scopes // If you only need one scope you can pass it as string 
});

console.log(url);