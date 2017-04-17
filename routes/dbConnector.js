/*
var db = function localConnect(){
    return require('mysql').createConnection({
        hostname: 'localhost',
        user: 'root',
        password: 'admin123',
        database: 'CS531'
    });
    connection.connect();
}
module.exports.localConnect = db;
*/

// Load module
var mysql = require('mysql');
// Initialize pool
var pool      =    mysql.createPool({
    connectionLimit : 10,
    host     : '127.0.0.1',
    user     : 'root',
    password : 'admin123',
    database : 'CS531',
    debug    :  false
});
module.exports = pool;
