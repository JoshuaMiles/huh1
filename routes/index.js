var express = require('express');
var router = express.Router();
const request = require('request');


// Get Homepage
router.get('/', function (req, res) {
  res.render('index');
});

module.exports = router;