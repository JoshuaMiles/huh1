// /**
//  * Created by joshm on 10/09/2016.
//  */
// var Promise = require('promise');
// var request = require('request');
// var accessToken = '326d8592e1e4a3c738268f5d9c91716fae2f697c5aba4f0c53977f6662ce7d08';
// var Twitter = require("twitter");
//
//
// var client = new Twitter({
//   consumer_key: 'yeSLIjDYWzzrVuahrH00ARvKL',
//   consumer_secret: 'T79sHvlB1loJfDPLgEkQiPuGZxeaD7GQRUZwWBZqGRQNGnts28',
//   access_token_key: '993514993-L42SpweTwbUojuUr5JzQDCWR93j5PWqW9W5vgABR',
//   access_token_secret: 'dpjOwzWZiVD8nJbrtdVEHEnmK1O5QmzJ1E5YF4MD0xFLM'
// });
//
// ;
//
// var employeeJSONObject = {
//   employeeID : '',
//   employeeRosterID: ''
// };
//
//
// // var newPromise;
// module.exports = new Promise(function (resolve, reject) {
//   request({
//     url: 'https://my.tanda.co/api/v2/schedules?user_ids=167973&from=2016-08-31&to=2016-09-30',
//     auth: {
//       'bearer': accessToken
//     }
//     // This is the async function that will not run until payload is populated
//   }, function (err, res) {
//     if (err) reject(err);
//     else resolve(res);
//   });
// }).then(function(payload){
//   var newPayload = JSON.parse(payload.body);
//   newPayload.map(function(i){
//     // When and where are they working?
//     employeeJSONObject.employeeID = i.id;
//     employeeJSONObject.employeeRosterID = i.roster_id;
//
//     // client.post('statuses/update', {status: i.id + " this really works =-D" }, function (error, tweet, response) {
//     //   if (error)
//     //     console.log("Error occured " + error);
//     //   console.log(tweet);  // Tweet body.
//     //   console.log("working " + tweet);
//     // });
//   }).then(function(anotherPayload){
//     request({
//       url: 'https://my.tanda.co/api/v2/schedules?user_ids=167973&from=2016-08-31&to=2016-09-30',
//       auth: {
//         'bearer': accessToken
//       }
//       // This is the async function that will not run until payload is populated
//     }
//   })
// }).catch(function(err){
//   console.error(err);
// });
// // Think about the tunnel, not relying on this even though you have it there
// // Do the logic after you export the function09