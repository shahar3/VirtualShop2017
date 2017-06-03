/**
 * Created by shaha on 02/06/2017.
 */
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
    userName: 'shahar',
    password: 'yakirHe1',
    server: 'champions.database.windows.net',
    // If you are on Microsoft Azure, you need this:
    options: {encrypt: true, database: 'Shop'}
}



var connection;
var columnNames;
var rowJson = {};
var arrayOfJsonRows = [];
var jsonObj;

function insert(query) {
    console.log(query);
    connection = new Connection(config);
    console.log("afterConnection");
    connection.on('connect', function (err) {
        if (err) {
            console.log(err);
        } else {
            request = new Request(query);
            connection.execSql(request);
        }
    });
}

function searchQuery(query,callback) {
    connection = new Connection(config);
    connection.on('connect', function (err) {
        // If no error, then good to proceed.
        if (err) {
            console.log(err);
        } else {
            queryDatabase(query,callback);
        }
    });
}



function queryDatabase(query,callback) {
    request = new Request(query
        ,function (err, rowCount,rows) {
            //console.log(rowJson);
            connection.close();
            jsonObj = {
                rows: arrayOfJsonRows,
                numberOfRows: rowCount
            };
            console.log('change jsonObj');
            callback(JSON.stringify(jsonObj));
        }
    );

    request.on('columnMetadata', function(columns){
        columnNames = [];
        columns.forEach(function(column){
            if(column.colName != null){
                columnNames.push(column.colName);
            }
        });
    });

    request.on('row', function (columns) {
        var counter = 0;
        columns.forEach(function (column){
            rowJson[columnNames[counter++]] = column.value;
        });
        arrayOfJsonRows.push(rowJson);
        rowJson = {};
    });

    connection.execSql(request);
}

module.exports.search = searchQuery;
module.exports.insert = insert;
