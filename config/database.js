var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

MongoClient.connect(url, function (err, db) {
  if(err) {
    console.log("Error connecting to the MongoDB server " + err);
  } else {
    console.log("Established a connection to ", url);
  }



  db.close();
});


module.exports = {
  url: 'mongodb://localhost:27017/my_database_name',
  options: {
    username: 'JoshM', password: 'babybacon3',
  },
};

