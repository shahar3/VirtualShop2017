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
    var userName = req.body.userName;
    var password = req.body.password;
    db.search("SELECT * FROM UserTb WHERE userName = '" + userName  + "' AND password = '" + password + "'",function (jsonObj) {
        res.send(jsonObj);
    });
});


router.post('/register', function(req,res){
    var userName = req.body.userName;
    var city = req.body.city;
    var password = req.body.password;
    var email = req.body.email;
    var country = req.body.country;
    var address = req.body.address;
    var phone = req.body.phone;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var cellular = req.body.cellular;
    var creditCardNumber = req.body.creditCardNumber;
    var favoriteTeam = req.body.favoriteTeam;
    var securityAnswer = req.body.securityAnswer;
    var cartId = req.body.cartId;
    var lastEntry = "NULL";
    var query ="INSERT INTO UserTb VALUES ('" + userName + "', '"+ city + "', '"+ password + "', '"+ email + "', '"+ country + "', '"+ address + "', '"+ phone + "', '"+ firstName + "', '"+ lastName + "', '"+ cellular + "', '"+ creditCardNumber + "', '"+ favoriteTeam + "', '"+ securityAnswer + "', '"+ cartId + "', " + lastEntry + ")";
    db.insert(query);
});

router.post('/login/restorePassword',function(req,res){
    var userName = req.body.userName;
    var securityAnswer = req.body.securityAnswer;
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
        res.send(json.rows[0].lastEntry);
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
            res.send(jsonRec);
        });
    });
});

router.post('/addToCart',function(req,res){
    var userName = req.body.userName;
    var itemName = req.body.itemName;
    console.log(userName + ":" + itemName);
    //get the user cart id
     var query = "SELECT * FROM UserTb WHERE userName = '" + userName + "'";
     db.search(query,function(jsonObj){
         var json = JSON.parse(jsonObj);
         var cartId = json.rows[0].cartId;
         //get the item id
         query = "SELECT itemId,price FROM Item WHERE itemName ='" + itemName + "'";
         db.search(query,function(jsonObj){
             var json = JSON.parse(jsonObj);
             var itemId = json.rows[0].itemId;
             var price = json.rows[0].price;
             //add the item to the cart table
             query = "INSERT INTO Cart VALUES('" + cartId + "','" + itemId + "','" + price + "')";
             db.insert(query);
         });

     });

});




module.exports = router;