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
};

var connection;
var columnNames;
var rowJson = {};
var arrayOfJsonRows = [];
var jsonObj;
var finished = false;

function searchQuery(query) {
    connection = new Connection(config);
    connection.on('connect', function (err) {
        // If no error, then good to proceed.
        if (err) {
            console.log(err);
        } else {
            console.log("Connected");
            queryDatabase(query);
            console.log('print jsonObj');
        }
    });
    //return JSON.stringify(jsonObj);
}

function queryDatabase(query) {
    request = new Request(query
        ,function (err, rowCount,rows) {
            //console.log(rowJson);
            connection.close();
            jsonObj = {
                rows: arrayOfJsonRows,
                numberOfRows: rowCount
            };
            console.log('change jsonObj');
            finished = true;
        }
    );

    request.on('columnMetadata', function(columns){
        columnNames = [];
        columns.forEach(function(column){
            if(column.colName != null){
                console.log("columnData");
                columnNames.push(column.colName);
            }
        });
    });

    request.on('row', function (columns) {
        console.log("row");
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