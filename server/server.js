/**
 * Created by joshm on 5/09/2016.
 */

var express = require('express');
var app = express();

var port = 8080 || process.argv[2];

app.get( '/', function(req,res) {
  res.send('./public/views/index.html');
});

app.listen(port, function() {
  console.log("Now listening on port " + port);
});