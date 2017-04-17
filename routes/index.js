var express = require('express');
var router = express.Router();

var db = require('./dbConnector');
var query = require('../middleware/query');

//variables to store the parsed data, after fetching from db
var pdLine = [], dtCode = [], dtDuration = [], pdShift =[];
//variable that stores all the pivot vars and send the data to client

var jsonArray;

/* GET home page. */
//index page would be the Search page

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Down Time Charts' });
  next();
});

router.get('/displayChart', function(req, resp){
  query.executeQuery(req.body.shift, req.body.date, resp);
});
/*
module.exports = function() {
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Down Time Charts' });
    //next();
  });
  router.post('/displayChart', function(req, res) {
      query(req, res);
  });
  return router;
};
*/
module.exports = router;
