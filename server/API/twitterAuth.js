// var Twitter = require('twitter');
var doTheThing = require('./promiseTest');

doTheThing.then(function(anotherPayload){
  console.log(anotherPayload);
});

// Twitter auth
// var client = new Twitter({
//   consumer_key: 'yeSLIjDYWzzrVuahrH00ARvKL',
//     consumer_secret: 'T79sHvlB1loJfDPLgEkQiPuGZxeaD7GQRUZwWBZqGRQNGnts28',
//     access_token_key: '993514993-L42SpweTwbUojuUr5JzQDCWR93j5PWqW9W5vgABR',
//     access_token_secret: 'dpjOwzWZiVD8nJbrtdVEHEnmK1O5QmzJ1E5YF4MD0xFLM'
// });
//
// var params = {screen_name: 'nodejs'};
//
// console.log(tanda);

