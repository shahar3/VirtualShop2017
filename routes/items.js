/**
 * Created by shaha on 02/06/2017.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('in items');
});

router.get('/getTopFive', function(req, res, next) {
    res.send('user requested top five');
});

router.get('/getItems', function(req, res, next) {
    res.send('user requested items');
    console.log(req.query);
});

router.get('/getNewItems', function(req, res, next) {
    res.send('user requested new items');
    console.log(req.query);
});

router.get('/sortBy', function(req, res, next) {
    res.send('user requested to sort items');
    console.log(req.query);
});

router.get('/getItemDetails', function(req, res, next) {
    res.send('user requested detail on item');
    console.log(req.query);
});

router.get('/searchItem', function(req, res, next) {
    res.send('user searched for item');
    console.log(req.query);
});
