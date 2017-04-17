//provide sql query
///var db = require('../routes/db.js')

/*
exports.create = function(userId, text, done) {
  var values = [userId, text, new Date().toISOString()]

  db.get().query('INSERT INTO comments (user_id, text, date) VALUES(?, ?, ?)', values, function(err, result) {
    if (err) return done(err)
    done(null, result.insertId)
  })
}

exports.getAll = function(done) {
  db.get().query('SELECT * FROM comments', function (err, rows) {
    if (err) return done(err)
    done(null, rows)
  })
}

//Production Line vs. Duration
exports.getByDateShift = function(downtimeDate, shift, cb) {
  db.get().query('SELECT * FROM DOWNTIME_SUMMARY WHERE LAST_UPDATED = ? and SHIFT = ?', function (err, rows) {
    if (err) return cb(err)
    res.render('customer',{page_title:"Customers Detail", data:rows});

    cb(null, rows);
  })
}*/

//Create pool and execute query
var pool = require('../routes/dbConnector');
//variables to store the parsed data, after fetching from db
var pdLine = [], dtCode = [], dtDuration = [], pdShift =[];
//variable that stores all the pivot vars and send the data to client

var jsonArray;

exports.executeQuery=function(downtimeDate, shift, callback){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          throw err;
        }
        connection.query('SELECT * FROM DOWNTIME_SUMMARY WHERE LAST_UPDATED = ? and SHIFT = ?', function(err,rows){
            connection.release();
            if(!err && !rows.length) {
                callback(null, {rows: rows});

            for(var i = 0; i < rows.length; i++) {
              pdLine[i] = rows[i].PROD_LINE;
              dtCode[i] = rows[i].DOWNTIME_CODE;
              dtDuration[i] = rows[i].TOTAL_DURATION;
              pdShift[i] = rows[i].SHIFT;
            }
              jsonArray = [pdLine, dtCode, dtDuration, pdShift];// array of arrays
              res.render('displayChart',{ layout : 'layout', mychart: jsonArray });
            }
        });

        connection.on('enqueue', function () {
          console.log('Waiting for available connection pool');
        });
        connection.on('release', function (connection) {
          console.log('Connection %d released', connection.threadId);
        });
        connection.on('error', function(err) {
              throw err;
              return;
        });

    });
}
