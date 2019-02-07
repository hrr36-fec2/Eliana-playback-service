var mysql = require('mysql');

dbConnection = mysql.createConnection({
  user: 'root',
  database: 'playlist',
  debug: true
});

dbConnection.connect(function (err) {
  console.log(err);
});

module.exports.dbConnection = dbConnection;