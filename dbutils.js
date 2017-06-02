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

var connection = new Connection(config);
connection.on('connect', function(err) {
    // If no error, then good to proceed.
    if(err){
        console.log(err);
    }else {
        console.log("Connected");
        queryDatabase();
    }
});

function queryDatabase() {
    request = new Request(
        "SELECT * FROM Cart",function (err, rowCount,rows) {
            console.log(rowCount + ' row(s) returned');
            connection.close();
        }
    );

    request.on('row', function (columns) {
        columns.forEach(function (column){
            console.log(column.value);
        });
    });

    connection.execSql(request);

}