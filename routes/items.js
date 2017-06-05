/**
 * Created by shaha on 02/06/2017.
 */
var express = require('express');
var router = express.Router();
var db = require('../dbutils');

router.get('/', function(req, res, next) {
    res.send('in items');
});

router.get('/getTopFive', function(req, res, next) {
    res.send('user requested top five');
});

router.get('/getItems', function(req, res, next) {
    console.log(req.query);
    var category = req.query.category;
    console.log(category);
    var queryStr;
    if(category!=null) {
        queryStr = "SELECT * FROM Item WHERE category = '" + category + "'";
    }else{
        queryStr = "SELECT * FROM Item";
    }
    db.search(queryStr,function (jsonObj) {
        res.send(jsonObj);
    });
});

router.get('/getNewItemsLastMonth', function(req, res, next) {
    //get the current date
    var curDate = new Date();
    var month = curDate.getMonth()+1;
    var year = curDate.getFullYear();
    console.log('month: '+month+' year: '+year);
    var queryStr = "SELECT * FROM Item WHERE MONTH(dateAdded) = "+ month +" AND YEAR(dateAdded) = " + year;
    db.search(queryStr,function (jsonObj) {
        res.send(jsonObj);
    })
    console.log(req.query);
});

router.get('/sortBy', function(req, res, next) {
    console.log(req.query);
    var sortBy = req.query.sortBy;
    var queryStr = "SELECT * FROM Item ORDER BY "+sortBy+" DESC";
    db.search(queryStr,function (jsonObj) {
        res.send(jsonObj);
    })
});

router.get('/getItemDetails', function(req, res, next) {
    console.log(req.query);
    var itemId = req.query.itemId;
    var queryStr = "SELECT * FROM Item where itemId = "+itemId;
    db.search(queryStr,function (jsonObj) {
        res.send(jsonObj);
    })
});

router.get('/searchItem', function(req, res, next) {
    console.log(req.query);
    var itemName = req.query.name;
    var queryStr = "SELECT * FROM Item where itemName = '" + itemName + "'"
    db.search(queryStr,function (jsonObj) {
        res.send(jsonObj);
    })
});

module.exports = router;
