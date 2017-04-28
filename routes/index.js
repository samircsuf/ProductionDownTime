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
//listX=prodLine&listY=Duration&selectShift=All&pdLine=%23+101&pdId=%23+1500&selectDtCategory=Planned&selectDtCode=PM&selectFromDate=2015-01-01&selectToDate=2015-01-01
router.get('/displayChart', function(req, res){
  var xAxis = req.query.listX;
  var yAxis = req.query.listY;
  var pdShift = req.query.selectShift;
  var pdLine = req.query.pdLine;
  var pdId = req.query.pdId;
  var dtCategory = req.query.selectDtCategory;
  var dtCode = req.query.selectDtCode;
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

  console.log('DOWNTIME_CATEGORY:',dtCategory);
  console.log('DOWNTIME_CODE:',dtCode);

  //todo : for a DT code,
  //and
  //DT category,
  //select all DT code ordered by duration
  if (pdShift === 'All')
    var pdShift1 = '';
  else
    var pdShift1 = pdShift;

  if (dtCategory === 'All')
    var dtCategory1 = '';
  else
    var dtCategory1 = dtCategory;

  if (dtCode === 'All')
    var dtCode1 = '';
  else
    var dtCode1 = dtCode;

  if (pdLine === '')
    var pdLine1 = 'All';
  else
    var pdLine1 = pdLine;

//DOWNTIME_CATEGORY like "%undefined" AND DOWNTIME_CODE like "%undefined"
  console.log('DOWNTIME_CATEGORY1:',dtCategory1);
  console.log('DOWNTIME_CODE1:',dtCode1);

  var queryString = 'SELECT SUM(TOTAL_DURATION) AS TOTAL_DURATION, '+pivot+' FROM DOWNTIME WHERE '+
  'DATE_VAL BETWEEN "'+fromDate+'" AND "'+toDate+'" AND '+
  'SHIFT like "%'+pdShift1+'" AND '+
  'PRODUCTION_LINE like "%'+pdLine+'" AND '+
  'DOWNTIME_CATEGORY like "%'+dtCategory1+'" AND '+
  'DOWNTIME_CODE like "%'+dtCode1+'" GROUP BY '
  +pivot+
  ' ORDER BY TOTAL_DURATION DESC';

  console.log('queryString', queryString);

  //without shift
  //var queryString1 = 'SELECT SUM(TOTAL_DURATION) AS TOTAL_DURATION, ' +pivot+ ' FROM DOWNTIME_SUMMARY WHERE DATE_VAL BETWEEN "' +fromDate+ '" AND "' +toDate+'" GROUP BY ' +pivot+ ' ORDER BY TOTAL_DURATION DESC';
  //with shift
  //var queryString2 = 'SELECT SUM(TOTAL_DURATION) AS TOTAL_DURATION, ' +pivot+ ' FROM DOWNTIME_SUMMARY WHERE SHIFT = "' +pdShift+ '" AND DATE_VAL BETWEEN "' +fromDate+ '" AND "' +toDate+'" GROUP BY ' +pivot+ ' ORDER BY TOTAL_DURATION DESC';

  //var queryString3 = 'SELECT SUM(TOTAL_DURATION) AS TOTAL_DURATION, ' +pivot+ ' FROM DOWNTIME_SUMMARY WHERE SHIFT = "' +pdCategory+ '" AND DATE_VAL BETWEEN "' +fromDate+ '" AND "' +toDate+'" GROUP BY ' +pivot+ ' ORDER BY TOTAL_DURATION DESC';
  //var queryString3 = 'SELECT SUM(TOTAL_DURATION) AS TOTAL_DURATION, ' +pivot+ ' FROM DOWNTIME_SUMMARY WHERE SHIFT = "' +pdCategory+ '" AND DATE_VAL BETWEEN "' +fromDate+ '" AND "' +toDate+'" GROUP BY ' +pivot+ ' ORDER BY TOTAL_DURATION DESC';
  //console.log('queryString1', queryString1);
  //console.log('queryString2', queryString2);

  pool.getConnection(function(err, connection) {
      if (err) {
          connection.release();
          throw err;
      }
      else{
        connection.query(queryString, function(err, rows) {
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
                shift: pdShift,
                prodLine: pdLine1,
                dtCategory: dtCategory,
                dtCode: dtCode
            });
            console.log('jsonArray', rows[2].TOTAL_DURATION);
        });
      /*if (pdShift === 'All') {
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

      }*/
    }
      //conditional rendering: if req.params. certain x and y value, print them
      //res.render('displayChart',{ layout : 'displayChart', dbdata : rows, pivot: 'TOTAL_DURATION', x : pivot, y : yAxis, shift: pdShift});
      //console.log('jsonArray', rows);
  });
  });
return router;
};
