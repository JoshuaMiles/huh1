/**
 * Created by joshm on 11/09/2016.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var Promise = require('promise');
var request = require('request');
var accessToken = 'TANDA_ACCESS_TOKEN';
var Twitter = require("twitter");
var moment = require("moment");

var client = new Twitter({
  consumer_key: 'CONSUMER_KEY',
  consumer_secret: 'CONSUMER_SECRET',
  access_token_key: 'ACCESS_TOKEN_KEY',
  access_token_secret: 'ACESS_TOKEN_SECRET'
});

router.get('/tanda-twitter', function (req, res) {

  var employeeIDArray = [];
  if (typeof res.req.query.ids === 'string') {
    employeeIDArray.push(res.req.query.ids);
  } else {
    employeeIDArray = res.req.query.ids;
  }
  var employeeArray = [];

  if(typeof employeeIDArray == 'undefined'){
    res.render('noEmployeesSelected',{message:"No Employees Where Selected"});
    return;
  }

  employeeIDArray.forEach(function (employeeID) {

    var shiftObject = {};
    shiftObject.date = res.req.query.date;
    shiftObject.employeeID = employeeID;

    tandlerSchedules(shiftObject).then(function (scheduleObject) {
      var scheduleJSONObj = JSON.parse(scheduleObject.body);
      start = new Date(scheduleJSONObj[0].start * 1000).toISOStringWithoutFormatting();
      finish = new Date(scheduleJSONObj[0].finish * 1000).toISOStringWithoutFormatting();
      shiftObject.start = timeTrim(start);
      shiftObject.finish = timeTrim(finish);

      shiftObject.department_id = scheduleJSONObj[0].department_id;

      return tandlerUser(shiftObject);

    }).then(function (userData) {
      var userJSON = JSON.parse(userData.body);
      shiftObject.name = userJSON.name;
      return tandlerDepartment(shiftObject);

    }).then(function (tandaDepartment) {
      var departmentJSONObj = JSON.parse(tandaDepartment.body);

      shiftObject.department_name = departmentJSONObj.name;
      shiftObject.location_id = departmentJSONObj.location_id;

      return tandlerDepartment(shiftObject);

    }).then(function (tandaDepartment) {
      var departmentJSONObj = JSON.parse(tandaDepartment.body);
      shiftObject.tandaLocation = departmentJSONObj.location_id;
      return tandlerLocation(shiftObject);
    }).then(function (tandaLocation) {
      console.log(tandaLocation.body);
      var locationJSONObj = JSON.parse(tandaLocation.body);

      shiftObject.latitude = locationJSONObj.latitude;
      shiftObject.longitude = locationJSONObj.longitude;
      shiftObject.url = encodeURIComponent("https://www.google.com/calendar/render?action=TEMPLATE&text=Working+at+the+" + shiftObject.department_name + "+&dates=" + shiftObject.start + "/" + shiftObject.finish + "&,&location=" + shiftObject.latitude + "," + shiftObject.longitude + "&sf=true&output=xml");

      return generateBitlyURL(shiftObject);

    }).then(function (bitlyData) {

      var bitlyJSONObj = JSON.parse(bitlyData.body);
      shiftObject.bitlyURL = bitlyJSONObj.data.url;
      employeeArray.push(shiftObject.name);

      return tweetPromise(shiftObject);

    }).catch(function (err) {
      console.error("There was an error when trying to complete your request: " + err);
    });
  });
      res.render('successfulTweet', {employee: employeeIDArray});
});

//Helper methods

function tandlerSchedules(shiftObject) {

  return new Promise(function (resolve, reject) {

    request({

      url: 'https://my.tanda.co/api/v2/schedules?' + 'user_ids=' + shiftObject.employeeID + '&from=' + shiftObject.date + '&to=' + shiftObject.date,
      auth: {
        'bearer': accessToken
      }
    }, function (err, res) {

      if (err) reject(err);
      else resolve(res);
    });
  });
}


function tweetPromise(shiftObject) {
  return new Promise(function (resolve, reject) {
        client.post('statuses/update', {status: shiftObject.name + ", you have have a shift " + shiftObject.bitlyURL + " #HereIsYourHours #huh" + shiftObject.employeeID}, function (error, tweet, response) {
          if (error)
            reject(error);
          resolve();
        });
      }
  )
}

function tandlerUser(shiftObject) {
  return new Promise(function (resolve, reject) {
    request({
      //TODO for each user
      url: 'https://my.tanda.co/api/v2/users/' + shiftObject.employeeID,
      auth: {
        'bearer': accessToken
      }
    }, function (err, res) {
      if (err) reject(err);
      else resolve(res);
    });
  });
}


function tandlerDepartment(shiftObject) {
  return new Promise(function (resolve, reject) {
    request({
      url: 'https://my.tanda.co/api/v2/departments/' + shiftObject.department_id,
      auth: {
        'bearer': accessToken
      }
    }, function (err, res) {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

function tandlerLocation(shiftObject) {
  console.log(shiftObject.location_id);
  return new Promise(function (resolve, reject) {
    request({

      url: 'https://my.tanda.co/api/v2/locations/' + shiftObject.location_id,
      auth: {
        'bearer': accessToken
      }
    }, function (err, res) {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

function generateBitlyURL(shiftObject) {
  return new Promise(function (resolve, reject) {
    request({

      url: 'https://api-ssl.bitly.com/v3/shorten?access_token=e44d39b5d5a41a3e6b1dae6058685ff4c3908ce5&longUrl=' + shiftObject.url,
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
 * Gets the department ID from the reponse of a Roster Object, given a certain day
 * @param rosObj
 * @param date
 */

function getDepartmentID(rosObj, date, ID) {
  rosObj.schedules.map(function (innerSchedule) {
    if (innerSchedule.date == date) {
      innerSchedule.schedules.map(function (individualSchedules) {
        if (individualSchedules.id == ID) {

          return individualSchedules.department_id;
        }
      });
    }
  })
}




// When getting the data back for
if (!Date.prototype.toISOStringWithoutFormatting) {
  ( function () {

    function pad(number) {
      var r = String(number);
      if (r.length === 1) {
        r = '0' + r;
      }
      return r;
    }

    Date.prototype.toISOStringWithoutFormatting = function () {

      return this.getUTCFullYear()
          + pad(this.getUTCMonth() + 1)
          + pad(this.getUTCDate())
          + 'T' + pad(this.getUTCHours())
          + pad(this.getUTCMinutes())
          + pad(this.getUTCSeconds())
          + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
          + 'Z';
    };
  }() );
}


// Trim the time because it had too many zeroes
function timeTrim(time) {
  return time.replace('000', '');
}

module.exports = router;