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

// const employeeID = 167973;


router.get('/tanda-twitter', (req, res) => {
  var tweet = req.body.tweet;
  var errors = req.validationErrors();
  // Use the employee roster ID to get the roster and than the location using the department id
  // all in all 3 level promise
  //TODO put the data into the shift object
  var employeeShiftArray = [];
  //TODO bootstrap date picker for post
  //TODO Checksum of the start
  console.log(res.req.query.date);
  var employeeIDArray = res.req.query.ids;
  const from = '2016-08-31';
  const to = '2016-09-30';

  // console.log(typeof employeeIDArray );

  employeeIDArray.forEach((employeeID) => {

        let shiftObject = {};
        shiftObject.date = res.req.query.date;
        shiftObject.employeeID = employeeID;
        console.log(employeeID);
        tandlerSchedules(from, to, shiftObject).then((scheduleObject) => {
          var scheduleJSONObj = JSON.parse(scheduleObject.body);

          start = new Date(scheduleJSONObj[0].start * 1000).toISOStringWithoutFormatting();
          finish = new Date(scheduleJSONObj[0].finish * 1000).toISOStringWithoutFormatting();

          shiftObject.start = timeTrim(start);
          shiftObject.finish = timeTrim(finish);

          shiftObject.department_id = scheduleJSONObj[0].department_id;
          return tandlerDepartment(shiftObject);

        }).then((tandaDepartment) => {
          var departmentJSONObj = JSON.parse(tandaDepartment.body);

          shiftObject.department_name = departmentJSONObj.name;
          shiftObject.location_id = departmentJSONObj.location_id;

          return tandlerDepartment(shiftObject);

        }).then(function (tandaDepartment) {
          var departmentJSONObj = JSON.parse(tandaDepartment.body);
          shiftObject.tandaLocation = departmentJSONObj.location_id;
          return tandlerLocation(shiftObject);
        }).then((tandaLocation) => {
          var locationJSONObj = JSON.parse(tandaLocation.body);
          shiftObject.latitude = locationJSONObj.latitude;
          shiftObject.longitude = locationJSONObj.longitude;

          shiftObject.url = encodeURIComponent("https://www.google.com/calendar/render?action=TEMPLATE&text=Working+at+" + shiftObject.department_name +  "+&dates=" + shiftObject.start + "/" + shiftObject.finish + "&,&location=" + shiftObject.latitude + "," + shiftObject.longitude + "&sf=true&output=xml");

          return generateBitlyURL(shiftObject);

        }).then((bitlyData) => {

          var bitlyJSONObj = JSON.parse(bitlyData.body);
          // console.log(bitlyJSONObj);
          shiftObject.bitlyURL = bitlyJSONObj.data.url;

          return tweetPromise(shiftObject);

        }).catch((err) => {

          console.error("There was an error when trying to complete your request: " + err);
        });
      }
  );
  req.flash('success_msg', 'You have now posted random twitter stuff');
});

//Helper methods

function tandlerSchedules(from, to, shiftObject) {

  return new Promise((resolve, reject) => {

    request({

      url: 'https://my.tanda.co/api/v2/schedules?' + 'user_ids=' + shiftObject.employeeID + '&from=' + from + '&to=' + to,
      auth: {
        'bearer': accessToken
      }
    }, function (err, res) {

      if (err) reject(err);
      else resolve(res);
    });
  });
}
//
// function googleAddress(shiftObject) {
//   return new Promise((resolve, reject) => {
//
//     request({
//       url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + shiftObject.latitude + "," + shiftObject.longitude,
//     }, function (err, res) {
//
//       if (err) reject(err);
//       else resolve(res);
//     });
//   });
// }

function tweetPromise(shiftObject) {
  return new Promise((resolve, reject) => {
        // console.log(shiftObject.bitlyURL);
        client.post('statuses/update', {status: "Employee Number #" + shiftObject.employeeID + " you have have a shift " + shiftObject.bitlyURL + " #HereIsYourHours"}, function (error, tweet, response) {
          if (error)
          reject(error);
        });
      }
  )
}

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



function tandlerDepartment(shiftObject) {
  return new Promise((resolve, reject) => {
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
  return new Promise((resolve, reject) => {
    request({

      url: 'https://my.tanda.co/api/v2/locations/' + shiftObject.location_id,
      auth: {
        'bearer': accessToken
      }
    }, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

function generateBitlyURL(shiftObject) {
  return new Promise((resolve, reject) => {
    request({

      url: 'https://api-ssl.bitly.com/v3/shorten?access_token=e44d39b5d5a41a3e6b1dae6058685ff4c3908ce5&longUrl=' + shiftObject.url,
      auth: {
        'bearer': accessToken
      }
    }, (err, res) => {
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
  rosObj.schedules.map((innerSchedule) => {
    if (innerSchedule.date == date) {
      innerSchedule.schedules.map((individualSchedules) => {
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