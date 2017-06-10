/**
 * Created by shaha on 06/06/2017.
 */
var express = require('express');
var router = express.Router();
var db = require('../dbutils');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("You are in /management");
});

router.post('/addUser', function (req,res) {
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

router.post('/deleteUser', function (req,res) {
    var userId = req.body.userId;
    var query = "DELETE FROM UserTb WHERE userId = '" + userId + "'";
});

router.post('/addItem', function (req,res) {
    var itemId = req.body.itemId;
    var quantity = req.body.quantity;
    var itemName = req.body.itemName;
    var description = req.body.description;
    var price = req.body.price;
    var dateAdded = new Date();
    var category = req.body.category;
    var country = req.body.country;
    var query = "INSERT INTO Item VALUES ('" + itemId + "', '"+ quantity + "', '"+itemName+"', '"+description+"', '"+price+"', '"+dateAdded+"', '"+category+"', '"+country+"'";
    db.insert(query);
});

router.post('/deleteItem', function (req,res) {

});

router.get('/getOrder', function (req,res) {

});

module.exports = router;