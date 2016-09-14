/**
 * Created by joshm on 10/09/2016.
 */
var tanda = require('./promiseTest');
var Twitter = require('twitter');


var client = new Twitter({
  consumer_key: 'yeSLIjDYWzzrVuahrH00ARvKL',
  consumer_secret: 'T79sHvlB1loJfDPLgEkQiPuGZxeaD7GQRUZwWBZqGRQNGnts28',
  access_token_key: '993514993-L42SpweTwbUojuUr5JzQDCWR93j5PWqW9W5vgABR',
  access_token_secret: 'dpjOwzWZiVD8nJbrtdVEHEnmK1O5QmzJ1E5YF4MD0xFLM',
});

tanda.then(function(resolve,reject){
  // console.log(payload);
  resolve(function(payload){
    var aString = payload.id + " " + payload.department_id + " Working " ;
    client.post('statuses/update', {status: aString }, function (error, tweet, response) {
      if (error)
        console.log("Error occured " + error);
      console.log(tweet);  // Tweet body.
      console.log("working " + tweet);
    });
  });
});
