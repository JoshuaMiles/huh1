var request = require('request');
var promise = require('promise');
var accessToken = '326d8592e1e4a3c738268f5d9c91716fae2f697c5aba4f0c53977f6662ce7d08';
var json = [];

function fetchAPI() {

  var promise = new Promise(function (fulfill, reject) {

    request({
      url: 'https://my.tanda.co/api/v2/schedules?user_ids=167973&from=2016-08-31&to=2016-09-30',
      auth: {
        'bearer': accessToken
      }
    }, function (err, res) {

      json = JSON.parse(res.body);

      //Get the id from the person
      // get the roster id


      MongoClient.connect("mongodb://localhost:27017/exampleDb", function (err, db) {
        if (err) {
          return console.dir(err);
        }

        var collection = db.collection('idAndRoster');

        // console.log(collection);

        json.map(function (i) {
          var employee = {"id": i.id, "roster_id": i.roster_id};
          console.log(i.id);
          collection.insert(employee);
        });

      });
    });
  });

  return promise;
}


function getTheShitThatIWant(data, callback) {
  json = data;

  // json.map(function(i) {
  //   console.log(i);
  // });
  callback(json);
  // module.exports = json;
}


// console.log(json);
