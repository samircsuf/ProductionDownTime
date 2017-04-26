//Create pool and execute query
var mysql = require('mysql');
var pool = require('./dbConnector');
//variables to store the parsed data, after fetching from db
//var pdLine = [], dtCode = [], dtDuration = [], pdShift =[];
//variable that stores all the pivot vars and send the data to client

//var jsonArray;

exports.executeQuery=function(req, callback){
    var dDate = req.params.selectDate;
    var dShift = req.params.selectShift;
    console.log('dDate',dDate);
    console.log('dShift',dShift);
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          throw err;
        }
        connection.query('SELECT * FROM DOWNTIME_SUMMARY WHERE DATE_VAL = ? and SHIFT = ?', [dDate,dShift], function(err,rows){
            connection.release();
            if(!err) {
              console.log('row:', rows[0]);
              callback(rows);
              /*for(var i = 0; i < rows.length; i++) {
                pdLine[i] = rows[i].PROD_LINE;
                dtCode[i] = rows[i].DOWNTIME_CODE;
                dtDuration[i] = rows[i].TOTAL_DURATION;
                pdShift[i] = rows[i].SHIFT;app.use(logger('dev'));

              }
                jsonArray = [pdLine, dtCode, dtDuration, pdShift];// array of arrays
                res.render('displayChart',{ layout : 'layout', mychart: jsonArray });
                console.log(jsonArray);
                //callback(null, {rows: rows});*/
            }
        //callback(jsonArray);
        });
        /*
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

    });*/
    //return jsonArray;
});
};
