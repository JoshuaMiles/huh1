/**
 * Created by joshm on 11/09/2016.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var Promise = require('promise');
var request = require('request');
var accessToken = '326d8592e1e4a3c738268f5d9c91716fae2f697c5aba4f0c53977f6662ce7d08';
var Twitter = require("twitter");
var moment = require("moment");

var client = new Twitter({
  consumer_key: 'yeSLIjDYWzzrVuahrH00ARvKL',
  consumer_secret: 'T79sHvlB1loJfDPLgEkQiPuGZxeaD7GQRUZwWBZqGRQNGnts28',
  access_token_key: '993514993-L42SpweTwbUojuUr5JzQDCWR93j5PWqW9W5vgABR',
  access_token_secret: 'dpjOwzWZiVD8nJbrtdVEHEnmK1O5QmzJ1E5YF4MD0xFLM'
});

const employeeID = 167973;
const from = '2016-08-31';
const to = '2016-09-30';

var shiftObject = {
  employeeID: '',
  name: '',
  employeeRosterID: '',
  start: '',
  finish: '',
  departmentID: '',
  departmentName: '',
  latitude: '',
  longitude: ''
};

// What does resolve do?
router.get('/tanda-twitter', function (req, res) {
  var tweet = req.body.tweet;
  var errors = req.validationErrors();
  // Use the employee roster ID to get the roster and than the location using the department id
  // all in all 3 level promise
  //TODO put the data into the shift object
  var employeeShiftArray = [];
//TODO bootstrap date picker for post
  //TODO Checksum of the start
  // Given the employee ID

  tandlerSchedules(from, to).then(function (scheduleObject) {
    var scheduleJSONObj = JSON.parse(scheduleObject.body);
    shiftObject.start = scheduleJSONObj[0].start;
    shiftObject.finish = scheduleJSONObj[0].finish;
    return tandlerDepartment(scheduleJSONObj[0].department_id);
  }).then(function (tandaDepartment) {
    var departmentJSONObj = JSON.parse(tandaDepartment.body);
    return tandlerLocation(departmentJSONObj.location_id);
  }).then(function (tandaLocation) {
    var locationJSONObj = JSON.parse(tandaLocation.body);
    shiftObject.latitude = locationJSONObj.latitude;
    shiftObject.longitude = locationJSONObj.longitude;
    var start = new Date(shiftObject.start * 1000).toISOStringWithoutFormatting();
    var finish = new Date(shiftObject.finish * 1000).toISOStringWithoutFormatting();
    start = timeTrim(start);
    finish = timeTrim(finish);
    // Use Google url shortener
    var url = "https://www.google.com/calendar/render?action=TEMPLATE&text=Work+for+&dates=" + start + "/" + finish + "&,&location=" + locationJSONObj.latitude + "," + locationJSONObj.longitude + "&sf=true&output=xml";
    console.log("https://www.google.com/calendar/render?action=TEMPLATE&text=Work+for+&dates=" + start + "/" + finish + "&,&location=" + locationJSONObj.latitude + "," + locationJSONObj.longitude + "&sf=true&output=xml");
    return generateBitlyURL(url);
  }).then(function (bitlyData) {
    var bitlyJSONObj = JSON.parse(bitlyData.body);

    return tweetPromise(bitlyJSONObj.data.url);
  }).catch(function (err) {
    console.error("There was an error when trying to complete your request: " + err);
  });
  req.flash('success_msg', 'You have now posted random twitter stuff');
});

function tandaUser() {
  return new Promise(function (resolve, reject) {
    request({
      url: 'https://my.tanda.co/api/v2/users?',
      auth: {
        'bearer': accessToken
      }
    }, function (err, res) {
      if (err) reject(err);
      else resolve(res);
    });
  });
}



//Helper methods

function tandlerSchedules(from, to) {
  return new Promise(function (resolve, reject) {
    request({
      url: 'https://my.tanda.co/api/v2/schedules?' + 'user_ids=' + employeeID + '&from=' + from + '&to=' + to,
      auth: {
        'bearer': accessToken
      }
    }, function (err, res) {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

function tweetPromise(url) {
  // return new Promise(function (reject, resolve) {

    //   client.post('statuses/update', {status:  "Employee Number " + employeeID + " you have have a shift, click here to add it to your calendar " + url}, function (error, tweet, response) {
    //     if (error)
    //       console.log("Error occured on your twitter request: " + error);
    //   });
    // }
    // )
}




function tandlerDepartment(scheduleID) {
  return new Promise(function (resolve, reject) {
    request({
      url: 'https://my.tanda.co/api/v2/departments/' + scheduleID,
      auth: {
        'bearer': accessToken
      }
    }, function (err, res) {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

function tandlerLocation(locationID) {
  return new Promise(function (resolve, reject) {
    request({

      url: 'https://my.tanda.co/api/v2/locations/' + locationID,
      auth: {
        'bearer': accessToken
      }
    }, function (err, res) {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

function generateBitlyURL(currentURL) {
  return new Promise(function (resolve, reject) {
    request({

      url: 'https://api-ssl.bitly.com/v3/shorten?access_token=e44d39b5d5a41a3e6b1dae6058685ff4c3908ce5&longUrl=' + currentURL,
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

function timeTrim(time) {
  return time.replace('000', '');
}

module.exports = router;