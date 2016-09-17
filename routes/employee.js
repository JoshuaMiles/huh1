/**
 * Created by joshm on 17/09/2016.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
const request = require('request');

var accessToken = '326d8592e1e4a3c738268f5d9c91716fae2f697c5aba4f0c53977f6662ce7d08';


router.get('/date-input', ensureAuthenticated, function (req, res) {
  // Do the logic needed
  // Can pass in JSON objects into here
  // Payload is what you call in the Handlebars
  // res.render('index', {payload:something});
  userArray = [];
  var date = res.req.query.date;

  tandlerUser().then(
      function (tandaUsers) {
        userArray = JSON.parse(tandaUsers.body);

        // console.log(tandaUsers.body);
        // var usersJSONObj = JSON.parse(tandaUsers.body);
        // console.log(usersJSONObj);
        // console.log(tandaUsers);

        return tandlerShifts(date);
      }
  ).then(
      function (rosters) {
        var rosterArray = JSON.parse(rosters.body);
        var employeeArray =[];
        rosterArray.forEach((rosteredEmployee)=> {
          userArray.forEach((employee)=> {
            if(rosteredEmployee.user_id == employee.id){
              employeeArray.push(employee);
            }
          });
        });
        res.render('employee', {employee:employeeArray,date:date});
      }
  ).catch(function (error) {
    // TODO error page for error
    res.render('error', error);
    console.error("There was an error when trying to complete your request: " + error);
  });
});

function tandlerUser() {
  return new Promise(function (resolve, reject) {
    request({
      //TODO for each user
      url: 'https://my.tanda.co/api/v2/users',
      auth: {
        'bearer': accessToken
      }
    }, function (err, res) {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

/**
 * Get the roster that contains a date, will return a 204 response if there is no roster.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */

function tandlerShifts(date) {
  return new Promise(function (resolve, reject) {
    request({
      url: 'https://my.tanda.co/api/v2/shifts?from=' + date + '&to=' + date,
      auth: {
        'bearer': accessToken
      }
    }, function (err, res) {
      if (err) reject(err);
      else resolve(res);
    });
  });
}


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect('/users/login');
  }
}

module.exports = router;