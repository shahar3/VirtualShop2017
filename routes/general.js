/**
 * Created by shaha on 02/06/2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("You are in /general");
});

module.exports = router;