/**
 * Created by Yakir Hershkoviz on 02/06/2017.
 */
var express = require('express');
var router = express.Router();
var db = require('../dbutils');


router.get('/', function(req, res, next) {
    res.send("You are in the /users");
});

router.post('/login', function(req,res){
    //var userName = req.body;
    //console.log(userName);
    //var password = req.query.password;
    //var userName = "yakirhe";
    //var password = "yakirhe";
    var userName = req.body.userName;
    var password = req.body.password;
    db.search("SELECT * FROM UserTb WHERE userName = '" + userName  + "' AND password = '" + password + "'",function (jsonObj) {
        console.log(jsonObj);
    });
    //res.send("check this user name");
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
    var query = "SELECT * FROM UserTb WHERE userName = '" + userName + "' AND securityAnswer = '" + securityAnswer + "'";
    db.search(query,function(jsonObj){
        var json = JSON.parse(jsonObj);
        console.log(json.rows[0].password);
    });

});

router.get('/getLastEntry', function(req,res){
    var userName = req.query.userName;
    var query = "SELECT * FROM UserTb WHERE userName = '" + userName + "'";
    db.search(query,function(jsonObj){
        var json = JSON.parse(jsonObj);
        console.log(json.rows[0].lastEntry);
    });
});

router.get('/recommendedItems',function(req,res){
    var userName = req.query.userName;
    //take the favourite team
    var query = "SELECT * FROM UserTb WHERE userName = '" + userName + "'";
    db.search(query,function(jsonObj){
        var json = JSON.parse(jsonObj);
        var favouriteTeam = (json.rows[0].favouriteTeam).split(" ");
        var country = favouriteTeam[1];
        console.log("favouriteTeamCountry: " + country);
        //recommended shirts from same same country
        query = "SELECT * FROM Item WHERE country = '" + country + "'";
        db.search(query,function (jsonRec) {
            var jsonRecomended = JSON.parse(jsonRec);
            //return the items id
            console.log(jsonRecomended.rows[0]);
        });
    });
});

router.post('/addToCart',function(req,res){
    var userName = req.body.userName;
    console.log(userName);
    // var itemId = req.query.itemId;
    // //get the user cart id
    // var query = "SELECT * FROM UserTb WHERE userName = '" + userName + "'";
    // db.search(query,function(jsonObj){
    //    var json = JSON.parse(jsonObj);
    //    var cartId = json.rows[0].cartId;
    //    console.log(cartId);
    //    //add the item to the cart table
    // });

});




module.exports = router;