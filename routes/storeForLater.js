/**
 * Current Twitter stuff
 */
// console.log(newPayload.map(function (i) {
//   console.log(i.id);
//   client.post('statuses/update', {status: i.id + " this really works =-D"}, function (error, tweet, response) {
//     if (error)
//       console.log("Error occured " + error);
//     console.log(tweet);
//     console.log("working " + tweet);
//   });
// }));


// tandlerSchedules('2016-08-31', '2016-09-30', 167973, accessToken)
//     .then(function (payload) {
//       var newPayload = JSON.parse(payload.body);
//       var employeePromises = [];
//       // Array of promises
//       // cant check fo
//       newPayload.forEach(function (i) {
//         var shiftObject = {
//           employeeID: '',
//           employeeRosterID: '',
//           start: '',
//           finish: '',
//           departmentID: '',
//           location: ''
//         };
//         shiftObject.employeeID = i.id;
//         shiftObject.roster_id = i.employeeRosterID;
//         shiftObject.start = i.start;
//         shiftObject.finish = i.finish;
//         //TODO make sure to be able to choose the date that is put into the
//         employeeShiftArray.push(shiftObject);
//       });
//
//       // For every employee ON A CERTAIN DAY,
//       //TODO make sure to limit the tweets to a certain day
//       tandlerRoster(76997,167973,accessToken).then();
//
//       // TODO use this to narrow down the roster of the person you want
//
//       // return employeeShiftArray;
//     }).then(function (anotherPayload) {
// }).catch(function (err) {
//   console.error("There was an error when trying to complete your request " + err);
// });



tandlerSchedules('2016-08-31', '2016-09-30', 167973, accessToken)
    .then(function (payload) {
      var newPayload = JSON.parse(payload.body);
      var employeePromises = [];
      // Array of promises
      // cant check fo
      newPayload.forEach(function (i) {
        //TODO make sure to be able to choose the date that is put into the
        return newPayload.roster_id;
      });

      // For every employee ON A CERTAIN DAY,
      //TODO make sure to limit the tweets to a certain day
      tandlerRoster(76997, 167973, accessToken).then();

      // TODO use this to narrow down the roster of the person you want

      // return employeeShiftArray;
    }).then(function (anotherPayload) {

}).catch(function (err) {
  console.error("There was an error when trying to complete your request " + err);
});