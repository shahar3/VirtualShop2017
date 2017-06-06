/**
 * Created by shaha on 06/06/2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("You are in /management");
});

router.post('/addUser', function (req,res) {
    
});

router.post('/deleteUser', function (req,res) {

});

router.post('/addItem', function (req,res) {

});

router.post('/deleteItem', function (req,res) {

});

router.get('/getOrder', function (req,res) {

});

module.exports = router;