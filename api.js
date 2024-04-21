var express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
var mysql = require('mysql');
var dbName = "pollDb";
var tableName = "pollData";

var con = mysql.createConnection({
    host: "localhost",
    user: "root",   
    port: 3306,
    password: ""
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/files/index.html', );
});

app.post('/submit', function (req, res) {
    var amount = -1;
    var selectQuery = "SELECT * FROM " + dbName + "." + tableName + " where id = "
    var updateQuery = "update " + dbName + "." + tableName + " set amount = ";
    if(req.body.input == 1 || req.body.input == 2) {
        console.log("Valid submission!");
        selectQuery += req.body.input + ";";
        con.query(selectQuery, function (err, result) {
            if (err) throw err;
            amount = result["0"].amount + 1;
            updateQuery += amount + " where id = " + req.body.input + ";";
            con.query(updateQuery, function (err, result) {
                if (err) throw err;
                console.log("Updated " + req.body.input);
                res.send('POST Request');
            });
        });
    } else {
        res.send("Invalid input!");
    }
});

var server = app.listen(8080, function () {
    var createDbQuery = 'CREATE DATABASE IF NOT EXISTS ' + dbName + ';';
    var createTableQuery = 'CREATE TABLE IF NOT EXISTS ' + dbName + '.' + tableName + ' (id int not null primary key AUTO_INCREMENT, name nvarchar(255) not null, amount int not null);';
    var checkTableQuery = 'SELECT * from ' + dbName + '.' + tableName;
    var populateTableQueryYes = 'INSERT INTO '+ dbName + '.' + tableName + "(name, amount) VALUES ('yes', 0)";
    var populateTableQueryNo = 'INSERT INTO '+ dbName + '.' + tableName + "(name, amount) VALUES ('no', 0)";

    console.log('Node server booting up\ndoing initial configs/checks');
    con.query(createDbQuery, function(err, result){
        if(err) throw err;
        console.log("DB Exists!");
        con.query(createTableQuery, function(err, result){
            if(err) throw err;
            console.log("Table Exists!");
            con.query(checkTableQuery, function(err, result){
                if(err) throw err;
                if(result.length == 0){
                    con.query(populateTableQueryYes, function(err, result){
                        if(err) throw err;
                    });
                    con.query(populateTableQueryNo, function(err, result){
                        if(err) throw err;
                    });
                    console.log("created Yes and No rows.");
                } else {
                 console.log("Rows already existed!");
                }
             });
        });
    });
});