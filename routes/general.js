/**
 * Created by shaha on 02/06/2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("You are in /general");
});

router.get('/changeCurrency',function (req,res) {
    if(req.query.currentCurrency == "dollar"){
        var newAmount = req.query.amount * 3.5;
        var jsonObj = {
            newAmount: newAmount
        }
        var json = JSON.stringify(jsonObj);
        res.send(json);
    }else{
        var newAmount = req.query.amount/3.5;
        var jsonObj = {
            newAmount: newAmount
        }
        var json = JSON.stringify(jsonObj);
        res.send(json);
    }
});

module.exports = router;