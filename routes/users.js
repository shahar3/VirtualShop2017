/**
 * Created by Yakir Hershkoviz on 02/06/2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("You are in the /users");
});


router.post('/login', function(req,res){
    var userName = req.query.userName;
    var password = req.query.password;
    res.send("check this user name");
});

router.post('/register', function(req,res){
    var userName = req.query.userName;
    var password = req.query.password;
    var email = req.query.email;
    var city = req.query.city;
    var country = req.query.country;
    var address = req.query.address;
    var phone = req.query.phone;
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    var cellular = req.query.cellular;
    var creditCardNumber = req.query.creditCardNumber;
    var favoriteTeam = req.query.favoriteTeam;
    var securityAnswer = req.query.securityAnswer;
});

router.post('/login/restorePassword',function(req,res){
   res.send("resore password");
});

router.get('getLastEntry', function(req,res){

});




module.exports = router;