var mysql = require('mysql');

dbConnection = mysql.createConnection({
  user: 'root',
  database: 'playlist'
});

dbConnection.connect(function (err) {
  if (err) {
    console.log(err);
  }
});

module.exports.dbConnection = dbConnection;
