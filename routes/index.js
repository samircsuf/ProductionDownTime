var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('../middleware/dbConnector');
var query = require('../middleware/query');

//variables to store the parsed data, after fetching from db
var pdLine = [], dtCode = [], dtDuration = [], pdShift =[];
//variable that stores all the pivot vars and send the data to client

var jsonArray;

module.exports = function() {
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Down Time Charts' });
  //next();
});

//instead working on disaplying charts from query.js
router.get('/displayChart', function(req, res){
  var xAxis = req.query.listX;
  var yAxis = req.query.listY;
  var pdShift = req.query.selectShift;
  var pdCategory = req.query.selectDtCategory;
  var fromDate = req.query.selectFromDate;
  var toDate = req.query.selectToDate;
  var pivot = '';

  if (xAxis === 'prodLine')
      pivot = 'PRODUCTION_LINE';
  else if (xAxis === 'pid')
      pivot = 'PRODUCT_ID';
  else if (xAxis === 'op')
      pivot = 'OPERATOR_NAME';
  else if (xAxis === 'tech')
      pivot = 'TECHNICIAN_NAME';
  else if (xAxis === 'dtCode')
      pivot = 'DOWNTIME_CODE';
  else if (xAxis === 'dtCategory')
      pivot = 'DOWNTIME_CATEGORY';
  else if (xAxis === 'shift')
      pivot = 'SHIFT';
  else if (xAxis === 'date')
      pivot = 'DATE_VAL';
  else
      pivot = 'PRODUCTION_LINE';

  console.log('pivot',pivot);
  console.log('duration',yAxis);
  console.log('params',req.query);
  //without shift
  var queryString1 = 'SELECT SUM(TOTAL_DURATION) AS TOTAL_DURATION, ' +pivot+ ' FROM DOWNTIME_SUMMARY WHERE DATE_VAL BETWEEN "' +fromDate+ '" AND "' +toDate+'" GROUP BY ' +pivot+ ' ORDER BY TOTAL_DURATION DESC';
  //with shift
  var queryString2 = 'SELECT SUM(TOTAL_DURATION) AS TOTAL_DURATION, ' +pivot+ ' FROM DOWNTIME_SUMMARY WHERE SHIFT = "' +pdShift+ '" AND DATE_VAL BETWEEN "' +fromDate+ '" AND "' +toDate+'" GROUP BY ' +pivot+ ' ORDER BY TOTAL_DURATION DESC';

  var queryString3 = 'SELECT SUM(TOTAL_DURATION) AS TOTAL_DURATION, ' +pivot+ ' FROM DOWNTIME_SUMMARY WHERE SHIFT = "' +pdCategory+ '" AND DATE_VAL BETWEEN "' +fromDate+ '" AND "' +toDate+'" GROUP BY ' +pivot+ ' ORDER BY TOTAL_DURATION DESC';
  var queryString3 = 'SELECT SUM(TOTAL_DURATION) AS TOTAL_DURATION, ' +pivot+ ' FROM DOWNTIME_SUMMARY WHERE SHIFT = "' +pdCategory+ '" AND DATE_VAL BETWEEN "' +fromDate+ '" AND "' +toDate+'" GROUP BY ' +pivot+ ' ORDER BY TOTAL_DURATION DESC';
  console.log('queryString1', queryString1);
  console.log('queryString2', queryString2);

  pool.getConnection(function(err, connection) {
      if (err) {
          connection.release();
          throw err;
      }
      else{
      if (pdShift === 'All') {
          connection.query(queryString1, function(err, rows) {
              connection.release();
              if (!err) {
                  console.log('row:', rows[0]);
              }
              res.render('displayChart', {
                  layout: 'displayChart',
                  dbdata: rows,
                  dbdata1: pivot,
                  x: pivot,
                  y: yAxis,
                  shift: pdShift
              });
              console.log('jsonArray', rows[2].TOTAL_DURATION);
          });
      } else {
          connection.query(queryString2, function(err, rows) {
              connection.release();
              if (!err) {
                  console.log('row:', rows[0]);
              }
              res.render('displayChart', {
                  layout: 'displayChart',
                  dbdata: rows,
                  dbdata1: pivot,
                  x: pivot,
                  y: yAxis,
                  shift: pdShift
              });
              console.log('jsonArray', rows);
          });

      }
    }
      //conditional rendering: if req.params. certain x and y value, print them
      //res.render('displayChart',{ layout : 'displayChart', dbdata : rows, pivot: 'TOTAL_DURATION', x : pivot, y : yAxis, shift: pdShift});
      //console.log('jsonArray', rows);
  });
  });
return router;
};
