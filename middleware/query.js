//Create pool and execute query
var pool = require('./dbConnector');
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
