/**
 * Created by Yakir Hershkoviz on 02/06/2017.
 */
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var db = require('../dbutils');
var app = express();
var qs = require('querystring');

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("You are in the /users");
});

router.post('/login', function(req,res){
    console.log(req.body.password);
    // db.search("SELECT * FROM UserTb WHERE userName = '" + userName  + "' AND password = '" + password + "'",function (jsonObj) {
    //     console.log(jsonObj);
    // });
    // res.send("check this user name");
});

router.post('/register', function(req,res){
    var userName = req.query.userName;
    var city = req.query.city;
    var password = req.query.password;
    var email = req.query.email;
    var country = req.query.country;
    var address = req.query.address;
    var phone = req.query.phone;
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    var cellular = req.query.cellular;
    var creditCardNumber = req.query.creditCardNumber;
    var favoriteTeam = req.query.favoriteTeam;
    var securityAnswer = req.query.securityAnswer;
    var cartId = req.query.cartId;
    var lastEntry = "NULL";
    var query ="INSERT INTO UserTb VALUES ('" + userName + "', '"+ city + "', '"+ password + "', '"+ email + "', '"+ country + "', '"+ address + "', '"+ phone + "', '"+ firstName + "', '"+ lastName + "', '"+ cellular + "', '"+ creditCardNumber + "', '"+ favoriteTeam + "', '"+ securityAnswer + "', '"+ cartId + "', " + lastEntry + ")";
    db.insert(query)
});

router.post('/login/restorePassword',function(req,res){
    var userName = req.query.userName;
    var securityAnswer = req.query.securityAnswer;
    var query = "SELECT * FROM UserTb WHERE 'userName"


});

router.get('getLastEntry', function(req,res){
    res.send("ok");
});




module.exports = router;