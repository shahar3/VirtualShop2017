/**
 * Created by shaha on 02/06/2017.
 */
var express = require('express');
var router = express.Router();
var db = require('../dbutils');

router.get('/', function(req, res, next) {
    res.send('in items');
});

//this function return the top 5 items that purchased more.
router.get('/getTopFive', function(req, res, next) {
    var queryStr = "SELECT * FROM Item JOIN ( SELECT TOP 7 itemId, count(*) total FROM OrderTb GROUP BY itemId order by total desc ) sub ON Item.itemId = sub.itemId";
    db.search(queryStr,function (jsonObj) {
        var json = JSON.parse(jsonObj);
        res.send(jsonObj);
    })
});

router.get('/getDateDiff',function (req,res) {
    var now = new Date();
    console.log(now);
    var query = "SELECT DATEDIFF(day,"+now+",OrderTb.dateOfOrder) AS DiffDate FROM OrderTb";
    db.search(query,function (jsonObj) {
        res.send(jsonObj);
    })
})

//this function return the all items or optionally the items from specific category
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

//return the new items from last month
router.get('/getNewItemsLastMonth', function(req, res, next) {
    //get the current date
    var curDate = new Date();
    var month = curDate.getMonth()+1;
    var year = curDate.getFullYear();
    console.log('month: '+month+' year: '+year);
    var queryStr = "SELECT * FROM Item WHERE MONTH(dateAdded) = "+ month +" AND YEAR(dateAdded) = " + year;
    db.search(queryStr,function (jsonObj) {
        res.send(jsonObj);
    });
    console.log(req.query);
});

//this function sort items vy category
router.get('/sortBy', function(req, res, next) {
    console.log(req.query);
    var sortBy = req.query.sortBy;
    var queryStr = "SELECT * FROM Item ORDER BY "+sortBy+" DESC";
    db.search(queryStr,function (jsonObj) {
        res.send(jsonObj);
    })
});

//this function get the items details
router.get('/getItemDetails', function(req, res, next) {
    console.log(req.query);
    var itemId = req.query.itemId;
    var queryStr = "SELECT * FROM Item where itemId = "+itemId;
    db.search(queryStr,function (jsonObj) {
        res.send(jsonObj);
    })
});

//this function return istem that similarry to the query search
router.get('/searchItem', function(req, res, next) {
    console.log(req.query);
    var queryStr;
    var itemName = req.query.name;
    var country = req.query.country;
    if(country!=null){
        queryStr = "SELECT * FROM Item where itemName = '" + itemName + "' and country = '" + country + "'";
    }
    else{
        queryStr = "SELECT * FROM Item where itemName = '" + itemName + "'";
    }
    db.search(queryStr,function (jsonObj) {
        res.send(jsonObj);
    })
});

module.exports = router;
