/**
 * Created by Yakir Hershkoviz on 02/06/2017.
 */
var express = require('express');
var router = express.Router();
var db = require('../dbutils');
var Promise = require('promise');


//This function return the currently date
function getDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10)
    {
        dd='0'+dd;
    }

    if(mm<10)
    {
        mm='0'+mm;
    }
    today = yyyy+'-'+mm+'-'+dd;
    return today;
}


router.get('/', function(req, res, next) {
    res.send("You are in the /users");
});

//This function uses for login user and return details about the user
router.post('/login', function(req,res){
    var userName = req.body.userName;
    var password = req.body.password;
    db.search("SELECT * FROM UserTb WHERE userName = '" + userName  + "' AND password = '" + password + "'",function (jsonObj) {
        res.send(jsonObj);
    });
});

//this function is for register user.
//take all the details of the user and insert into our database.
//we return details about the user.
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
    var lastEntry = getDate();
    var cartId;
    //create cart id for the user
    var query = "SELECT * FROM UserTb";
    db.search(query,function (jsonObj) {
        var json = JSON.parse(jsonObj);
        cartId = json.numberOfRows+1;
        console.log(userName + ":"+ city+ ":"+password+ ":"+email+ ":"+country+ ":"+address+ ":"+phone+ ":"+firstName+ ":"+lastName+ ":"+cellular+ ":"+creditCardNumber+ ":"+favoriteTeam+ ":"+securityAnswer+ ":"+cartId+ ":"+lastEntry);
        var query ="INSERT INTO UserTb VALUES ('" + userName + "', '"+ city + "', '"+ password + "', '"+ email + "', '"+ country + "', '"+ address + "', '"+ phone + "', '"+ firstName + "', '"+ lastName + "', '"+ cellular + "', '"+ creditCardNumber + "', '"+ favoriteTeam + "', '"+ securityAnswer + "', '"+ cartId + "', '" + lastEntry + "')";
        //query = "INSERT INTO UserTb VALUES('michal',"
        db.insert(query,function () {
            query = "SELECT * FROM UserTb WHERE userName = '" + userName + "'";
            db.search(query,function (jsonO) {
                res.send(jsonO);
            });
        });
    });

});

//this function uses for resore password for regisered user.
router.post('/restorePassword',function(req,res){
    var userName = req.body.userName;
    var securityAnswer = req.body.securityAnswer;
    var query = "SELECT * FROM UserTb WHERE userName = '" + userName + "' AND securityAnswer = '" + securityAnswer + "'";
    db.search(query,function(jsonObj){
        res.send(jsonObj);
    });
});

//this function get the last entry of spcific user
router.get('/getLastEntry', function(req,res){
    var userName = req.query.userName;
    var query = "SELECT * FROM UserTb WHERE userName = '" + userName + "'";
    db.search(query,function(jsonObj){
        var json =
            {
                "result":true,
                "count":1
            }
        res.send(json);
    });
});

//this function uses for create recommended items for regisred user.
//we recomended items that are from same country.
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

//this function add items to the user cart
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
            if(json.numberOfRows != 0) {
                var itemId = json.rows[0].itemId;
                var price = json.rows[0].price;
                //check if the cart already exist this item
                query = "SELECT * FROM Cart WHERE cartId ='" + cartId + "' AND itemId = '" + itemId + "'";
                db.search(query, function (jsonObj) {
                    json = JSON.parse(jsonObj);
                    if (json.numberOfRows == 0) {
                        console.log("insert in if");
                        query = "INSERT INTO Cart VALUES('" + cartId + "','" + itemId + "','" + price + "', '1')";
                        db.insert(query, function () {
                            var obj = {
                                "cartId":cartId,
                                "itemId":itemId,
                                "price":price,
                                "numberOfItem": 1
                            }
                            var json = JSON.stringify(obj);
                            res.send(json);
                        });
                    } else {
                        console.log("insert in else");
                        var numberOfItem = parseInt(json.rows[0].numberOfItem, 10) + 1;
                        query = "UPDATE Cart SET numberOfItem =" + numberOfItem + "WHERE cartId = '" + cartId + "' AND itemId ='" + itemId + "'";
                        db.insert(query, function () {
                            res.send("we are update your amount of this item");
                        });
                    }
                });
            }else{
                res.send(json);
            }
        });
    });
});

//this function return json that contain the details of user cart items.
router.get('/displayTheCartItems',function (req,res){
    var userName = req.query.userName;
    //get the user cart id
    var query = "SELECT * FROM UserTb WHERE userName = '" + userName + "'";
    db.search(query,function(jsonObj) {
        var json = JSON.parse(jsonObj);
        var cartId = json.rows[0].cartId;
        //get the cart items
        query = "SELECT itemId,price FROM Cart WHERE cartId = '" + cartId + "'";
        db.search(query,function (jsonObj) {
            res.send(jsonObj);
        });
    });
});


//this function get item name and user and rempove this item from the user cart.
router.post('/removeCartItem',function(req,res){
    var userName = req.body.userName;
    var itemName = req.body.itemName;
    //get the item id
    var query = "SELECT itemId FROM Item WHERE itemName = '" + itemName + "'";
    db.search(query,function(jsonObj){
        var json = JSON.parse(jsonObj);
        if(json.numberOfRows != 0) {
            var itemId = json.rows[0].itemId;
            query = "SELECT cartId From UserTb WHERE userName = '" + userName + "'";
            db.search(query, function (jsonObj) {
                var json = JSON.parse(jsonObj);
                if(json.numberOfRows != 0) {
                    var cartId = json.rows[0].cartId;
                    //delete the item from the cart
                    query = "DELETE FROM Cart WHERE itemId ='" + itemId + "' AND cartId = '" + cartId + "'";
                    db.insert(query, function () {
                        var obj = {
                            "itemId": itemId,
                            "cartId": cartId
                        }
                        json = JSON.stringify(obj);
                        res.send(json);
                    });
                }else{
                    var obj = {};
                    json = JSON.stringify(obj);
                    res.send(json);
                }
            });
        }else{
            var obj = {};
            json = JSON.stringify(obj);
            res.send(json);
        }
    });
});

router.get('/getThePreviousOrders',function (req,res){
    var userName = req.query.userName;
    var query = "Select * FROM OrderTb WHERE userName ='" + userName + "'";
    db.search(query,function (jsonObj) {
        var json = JSON.parse(jsonObj);
        res.send(json);
    });
});

//this function return the orderd details
router.get('/getOrderDetails',function (req,res) {
    var userName = req.query.userName;
    var itemName = req.query.itemName;
    //get the item id
    var query = "SELECT itemId FROM Item WHERE itemName = '" + itemName + "'";
    db.search(query,function(jsonObj) {
        var json = JSON.parse(jsonObj);
        if(json.numberOfRows != 0) {
            var itemId = json.rows[0].itemId;
            //get the order details
            query = "SELECT * FROM OrderTb WHERE userName = '" + userName + "' AND itemId = '" + itemId + "'";
            db.search(query, function (jsonObj) {
                json = JSON.parse(jsonObj);
                res.send(json);
            });
        }else{
            var obj = {};
            json = JSON.stringify(obj);
            res.send(json);
        }
    });
});

//this function uses for purchase user cart.
router.post('/purchaseCart',function(req,res) {
    var userName = req.body.userName;
    var dateToDelivery = req.body.dateToDelivery;
    var itemId = "";
    //get the user cart id
    var query = "SELECT cartId From UserTb WHERE userName = '" + userName + "'";
    var resToSend = "";
    var json="";
    db.search(query, function (jsonObj) {
        json = JSON.parse(jsonObj);
        if(json.numberOfRows != 0) {
            var cartId = json.rows[0].cartId;
            //get all the cart items of the user
            query = "SELECT * FROM Cart WHERE cartId = '" + cartId + "'";
            db.search(query, function (jsonObj) {
                json = JSON.parse(jsonObj);
                var amountOfProduct = json.numberOfRows;
                if(amountOfProduct != 0) {
                    selectFromCart(userName, dateToDelivery, cartId).then(function (result) {
                        return insertToOrder(result, userName, dateToDelivery);
                    }).then(function (result) {
                        return deleteFromCart(result, cartId);
                    }).then(function (result) {
                        amountOfProduct = amountOfProduct - 1;
                    });
                    res.send(json);
                }else{
                    var obj = {};
                    json = JSON.stringify(obj);
                    res.send(json);
                }
            });
        }else{
            var obj = {};
            json = JSON.stringify(obj);
            res.send(json);
        }
    });
});


//delete from cart
let deleteFromCart = function (result,cartId) {
    return new Promise(function(resolve,reject){
        //delete the cart item that ordered
        var parseJson = JSON.parse(result);
        var query = "DELETE FROM Cart WHERE cartId='" + cartId +"'";
        db.insert(query,function () {
            resolve("DONE!");
        });
    });
};

//get the user cart details
let selectFromCart = function (userName,dateToDelivery,cartId) {
    return new Promise(function (resolve,reject) {
        var query = "SELECT * FROM Cart WHERE cartId ='" + cartId + "'";
        db.search(query, function (jsonObj) {
            var json = JSON.parse(jsonObj);
            var arrayOfJsonRows = [];
            var i;
            var rowCount = json.numberOfRows;
            jsonObj = {
                rows: arrayOfJsonRows,
                numberOfRows: rowCount
            };
            for(i=0;i < json.numberOfRows;i++) {
                var arrayOfJson = {};
                //insert the details to orders table
                arrayOfJson["itemId"] = json.rows[i].itemId;
                arrayOfJson["price"] = json.rows[i].price;
                arrayOfJson["numberOfItem"] = json.rows[i].numberOfItem;
                arrayOfJson["today"] = getDate();
                arrayOfJsonRows.push(arrayOfJson);
            }
            var jsonToReturn = JSON.stringify(jsonObj);
            resolve(jsonToReturn);
        });
    });
};

//insert to order
let insertToOrder = function (result,userName,dateToDelivery) {
    return new Promise(function(resolve,reject){
        var parseJson = JSON.parse(result);
        //create order id
        var countQuery = "SELECT * FROM OrderTb";
        var query = "";
        db.search(countQuery,function (jsonObj) {
            var json = JSON.parse(jsonObj);
            var numberOfRows = json.numberOfRows;
            //create query that insert few records into the table
            var i;
            query += "INSERT INTO OrderTb VALUES";
            for(i=0;i<parseJson.numberOfRows;i++) {
                query += "('" + ++numberOfRows + "','" + parseJson.rows[i].itemId + "','" + userName + "','" + parseJson.rows[i].price + "','" + parseJson.rows[i].numberOfItem + "','" + parseJson.rows[i].today + "','" + dateToDelivery + "')";
                if(i!=parseJson.numberOfRows-1){
                    query += ",";
                }
            }
            db.insert(query,function(){
                resolve(result);
            });
        });

    });
};

//return the order confirmation for specific date.
router.get('/orderConfirmation',function(req,res) {
    var userName = req.query.userName;
    var dateOfOrder = req.query.dateOfOrder;
    var query = "SELECT * FROM OrderTb WHERE userName='" + userName +"' AND dateOfOrder='"+ dateOfOrder +"'";
    db.search(query,function(jsonObj){
        var json = JSON.parse(jsonObj);
        res.send(json);
    });
});


module.exports = router;