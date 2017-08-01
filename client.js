/**
 * Created by Yakir Hershkoviz on 20/06/2017.
 */
// var app = angular.module('myApp', ['ngRoute']);
//
// //app config
// app.config(['$routeProvider', function ($routeProvider) {
//     $routeProvider
//         .when("/", {
//             templateUrl: "views/testHtml.html",
//             controller: "homePageImageController"
//         })
//         .when("/login", {
//             templateUrl: "views/loginPage.html",
//             controller: "loginController"
//         }).when("/register", {
//         templateUrl: "views/register.html",
//         controller: "registerController"
//     }).when("/items", {
//         templateUrl: "views/itemsPage.html",
//         controller: "itemsPageController"
//     }).when("/cart",{
//         templateUrl: "views/cartPage.html",
//         controller: "cartController"
//     })
//         .otherwise({
//             redirect: '/',
//         });
// }]);
var app = angular.module('myApp', ['ngRoute']);

//app config
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/homePage.html",
            controller: "homePageImageController"
        })
        .when("/login", {
            templateUrl: "views/loginPage.html",
            controller: "loginController"
        }).when("/register", {
        templateUrl: "views/register.html",
        controller: "registerController"
    }).when("/items", {
        templateUrl: "views/itemsPage.html",
        controller: "itemsPageController"
    }).when("/cart",{
        templateUrl: "views/cartPage.html",
        controller: "cartController"
    }).when("/orderPage",{
        templateUrl: "views/orderpage.html",
        controller: "orderController"
    })
        .otherwise({
            redirect: '/',
        });
}]);

app.controller('orderController',function ($scope,$http,$location,openPageService,currentUserNameService) {
    var path = "http://localhost:3000/users/getThePreviousOrders?userName=ben";
    var params = {"username": currentUserNameService.currentUserNameFunc()};
    $http({
        url: path,
        method: "GET",
        params: params
    }).then(function (response) {
        $scope.teamsFirstCol = response.data.rows;
    });
    $scope.getDetails = function (itemId) {
        var path = "http://localhost:3000/items/getItemDetails";
        params = {"itemId": itemId};
        $http({
            url: path,
            method: "GET",
            params: params
        }).then(function (response) {
            var itemDetails = response.data.rows[0];
            var myWindow = window.open("","detailsWindow","width=500,height=400");
            myWindow.document.write("Item Name: " + itemDetails.itemName + ", Size: " + itemDetails.description +
                ", Price: " + itemDetails.price + ", category: " + itemDetails.category);
        });
    }
});

app.controller('loginController', function ($scope, $http, $location, openPageService,currentUserNameService) {
    $scope.onlyNumbers = /^\d+$/;
    $scope.checkDetailsOnClick = function () {
        var params = {"userName": $scope.userName, "password": $scope.password};
        $http.post("http://localhost:3000/users/login", params).then(function (response) {
            var data = response.data;
            if (data.numberOfRows == 0) {
                alert("user name or password are incorrect");
            } else {
                currentUserNameService.updateCurrentUserName($scope.userName);
                currentUserNameService.updaeLastEntry(response.data.rows[0].lastEntry);
                document.cookie = "login" + $scope.userName + "-----" + $scope.password + "; secure;";
                openPageService.openPage('/');
            }
            $scope.test = response.data;
        });
    }
    $scope.backToHomePage = function () {
        $location.path('/');
    }
    $scope.restorePassword = function () {
        var securityAnswer = $scope.securityAnswer;
        var userName = $scope.userNameRestore;
        var params = {"userName": userName, "securityAnswer": securityAnswer};
        $http.post("http://localhost:3000/users/restorePassword", params).then(function (response) {
            alert("Your password: " + response.data.rows[0].password);
        });
    }
    $scope.getSecurityQuestion = function () {
        var userName = $scope.userNameRestore;
        var path = "http://localhost:3000/users/getLastEntry?userName=" + userName;
        var params = {"username": userName};
        $http({
            url: path,
            method: "GET",
            params: params
        }).then(function (response) {
            $scope.securityQuestion = response.data;
            //$http.post("")
        });
    }
});

app.controller('testC', function ($http) {
    var params = {};
    $http.post("http://localhost:3000/users/restorePassword", params).then(function (response) {
        alert(response.data);
    });
});

app.controller('homePageController', function ($scope, $http, $location, openPageService) {
    $scope.openLoginPage = function () {
        openPageService.openPage('/login');
    }

});

app.controller('homePageImageController', function ($scope, $http, $location, openPageService,currentUserNameService,addToCartService) {
    $http.get("http://localhost:3000/items/getTopFive").then(function (response) {
        $scope.teamsFirstCol = response.data.rows;
        $http.get("http://localhost:3000/items/getNewItemsLastMonth").then(function(response){
           $scope.teamsRecCol = response.data.rows;
        });
    });
    if(currentUserNameService.currentUserNameFunc()==""){
        $scope.userSignIn = false;
        $scope.afterUserSignIn = false;
    }else{
        $scope.afterUserSignIn = true;
        $scope.userSignIn = true;
        $scope.currentUser = currentUserNameService.currentUserNameFunc();
        $scope.lastEntry = currentUserNameService.currentLastEntry();
    }
    $scope.test = function () {
        alert("testfunction");
    };
    // $scope.signInDisplay = checkLogInUser.checkLogIn;
    $scope.displayPage = function (path) {
        openPageService.openPage(path);
    };
    $scope.displayItemsPage = function () {
        openPageService.openPage('/items');
    }
    $scope.addToCart = function (itemName) {
        addToCartService.addToCart(itemName);
        // if(currentUserNameService.currentUserNameFunc() == ""){
        //     alert("You need to login before making a purchase");
        //     return;
        // }
        // var params = {"userName":currentUserNameService.currentUserNameFunc(),"itemName": itemName };
        // $http.post("http://localhost:3000/users/addToCart",params).then(function (response) {
        //     alert("The item was added to the cart");
        // });
    }
});

app.factory('CurrentuserName',function (userName) {
    var userName = userName;
    return{
        //userName
   }
});

app.controller('itemsPageController', function ($scope, $http, $location,currentUserNameService,openPageService,addToCartService) {
    if(currentUserNameService.currentUserNameFunc()==""){
        $scope.afterUserSignIn = false;
    }else{
        $scope.afterUserSignIn = true;
        $scope.currentUser = currentUserNameService.currentUserNameFunc();
        $scope.lastEntry = currentUserNameService.currentLastEntry();
    }
    $http({
        url: "http://localhost:3000/items/getItems",
        method: "GET",
    }).then(function (response) {
        $scope.teamsFirstCol = response.data.rows;
        var userName;
        if(currentUserNameService.currentUserNameFunc()==""){
            return;
        }else{
            userName = currentUserNameService.currentUserNameFunc();
        }
        var param = {"userName": userName};
        var path = "http://localhost:3000/users/recommendedItems";
        $http({
            url: path,
            method: "GET",
            params: param
        }).then(function (response) {
            $scope.teamsRecCol = response.data.rows;
        })
    })
    $scope.getItems = function (category) {
        var param = {"category":category};
        $http({
            url:"http://localhost:3000/items/getItems",
            method: "GET",
            params:param
        }).then(function (response) {
            $scope.teamsFirstCol = response.data.rows;
        })
    };
    $scope.addToCart = function (itemName) {
        addToCartService.addToCart(itemName);
    };
    $scope.searchItems = function () {

    }
    $scope.displayPage = function (path) {
        openPageService.openPage(path);
    };
    $scope.sortBy = function (sortBy) {
        alert("sortBy");
        if(sortBy=="Size"){
            sortBy = "description";
        }
        var params = {"sortBy":sortBy};
        $http({
            url: "http://localhost:3000/items/sortBy",
            method: "GET",
            params: params
        }).then(function (response) {
            $scope.teamsFirstCol = response.data.rows;
        });
    };
});



app.controller('registerController', function ($scope, $http, $location, openPageService) {
    //read xml file
    var ajxObj;
    if(window.XMLHttpRequest){
        ajxObj = new XMLHttpRequest();
    }else{
        ajxObj = new ActiveXObject('Microsoft.XMLHTTP');
    }
    ajxObj.open('GET','countries.xml',false);
    ajxObj.send();
    var myXml = ajxObj.responseText;
    var country = myXml.getElementsByTagName("Country");
    document.write(country[0].getElementsByTagName("ID")[0].childNodes[0].nodeValue);

    // if(!xmlData){
    //     xmlData = (new DOMParser()).parseFromString(xml.responseText,'text/xml');
    //     var emp = xmlData.getElementsByTagName("Countries");
    // var firstCountry = xmlData.data.getElementsByTagName("ID");
    // alert(firstCountry[0]);
    // alert(firstCountry);
    // var firstCountry = emp.getElementsByTagName("NAME")[0].firstChild.data;
    //     alert(firstCountry);
    // }
    $scope.backToHomePage = function () {
        openPageService.openPage('/');
    };
    $scope.addUser = function () {
        var params = {
            "userName": $scope.userName,
            "city": $scope.city,
            "password": $scope.password,
            "email": $scope.email,
            "country": $scope.country,
            "address": $scope.address,
            "phone": $scope.phone,
            "firstName": $scope.firstName,
            "lastName": $scope.lastName,
            "cellular": $scope.cellular,
            "creditCardNumber": $scope.creditCardNumber,
            "favouriteTeam": $scope.favoriteTeam,
            "favouriteCategories": $scope.favoriteCategories,
            "securityQuestion": $scope.securityQuestion,
            "securityAnswer": $scope.securityAnswer
        }
        $http.post("http://localhost:3000/users/register", params).then(function (response) {
            var data = response.data;
            if (data.numberOfRows > 0) {
                alert("You have signed up");
                openPageService.openPage('/login');
            } else {
                alert("There was a problem, please try again");
            }
        });
    };
});

app.controller('cartController',function ($scope, $http, $location,currentUserNameService,openPageService) {
    var allSortedItems = {};
    var params = {"userName": currentUserNameService.currentUserNameFunc()};
    $http({
        url:"http://localhost:3000/users/displayTheCartItems",
        method:"GET",
        params:params
    }).then(function (response) {
        $scope.teamsFirstCol = response.data.rows;
        var userName = currentUserNameService.currentUserNameFunc();
        var path = "http://localhost:3000/users/getLastEntry?userName=" + userName;
        var params = {"username": userName};
        $http({
            url: path,
            method: "GET",
            params: params
        }).then(function (response) {
            $scope.totalPrice = response.data;
        });
    });
    $scope.removeFromCart = function (itemId) {
        var userName = currentUserNameService.currentUserNameFunc();
        var params = {"userName":userName,"itemId":itemId};
        $http.post("http://localhost:3000/users/RemoveCartItem",params).then(function (response) {
            params = {"userName": currentUserNameService.currentUserNameFunc()};
            $http({
                url:"http://localhost:3000/users/displayTheCartItems",
                method:"GET",
                params:params
            }).then(function (response) {
                $scope.teamsFirstCol = response.data.rows;
                userName = currentUserNameService.currentUserNameFunc();
                var path = "http://localhost:3000/users/getLastEntry?userName=" + userName;
                params = {"username": userName};
                $http({
                    url: path,
                    method: "GET",
                    params: params
                }).then(function (response) {
                    $scope.totalPrice = response.data;
                });
            });
        });

    };
    $scope.getDetails = function (itemId) {
        var path = "http://localhost:3000/items/getItemDetails";
        params = {"itemId": itemId};
        $http({
            url: path,
            method: "GET",
            params: params
        }).then(function (response) {
            var itemDetails = response.data.rows[0];
            var myWindow = window.open("","detailsWindow","width=500,height=400");
            myWindow.document.write("Item Name: " + itemDetails.itemName + ", Size: " + itemDetails.description +
            ", Price: " + itemDetails.price + ", category: " + itemDetails.category);
        });
    }
    $scope.sortBy = function (sortBy) {
        if(sortBy=="Size"){
            sortBy="description";
        }
        var params = {"sortBy":sortBy};
        $http({
            url: "http://localhost:3000/items/sortBy",
            method: "GET",
            params: params
        }).then(function (response) {
            var sortedItems=[];
            // $scope.teamsFirstCol = response.data.rows;
            allSortedItems = response.data;
            //get the cartItem
            var params = {"userName": currentUserNameService.currentUserNameFunc()};
            $http({
                url:"http://localhost:3000/users/displayTheCartItems",
                method:"GET",
                params:params
            }).then(function (response) {
                for(var i = 0;i < allSortedItems.numberOfRows;i++){
                    for(var j = 0;j < response.data.numberOfRows;j++){
                        if(response.data.rows[j].itemId == allSortedItems.rows[i].itemId){
                            sortedItems.push(allSortedItems.rows[i]);
                        }
                    }
                }
                $scope.teamsFirstCol = sortedItems;
                var userName = currentUserNameService.currentUserNameFunc();
                var path = "http://localhost:3000/users/getLastEntry?userName=" + userName;
                var params = {"username": userName};
                $http({
                    url: path,
                    method: "GET",
                    params: params
                }).then(function (response) {
                    $scope.totalPrice = response.data;
                });
            });
        });
    };
    $scope.displayPage = function (path) {
        openPageService.openPage(path);
    };
});

app.factory('openPageService', function ($location) {
    return {
        openPage: function (url) {
            $location.path(url);
        }
    }
});

app.factory('currentUserNameService',function () {
   var currentUserName = "";
   var currentLastEntry = "";
   return{
       currentUserNameFunc: function () {
           return currentUserName;
       },
       updateCurrentUserName: function (userName) {
           currentUserName = userName;
       },
       updaeLastEntry: function (lastEntry) {
           currentLastEntry = lastEntry;
       },
       currentLastEntry: function () {
            return currentLastEntry;
       }
   }
});

app.factory('addToCartService',function ($http,currentUserNameService) {
   return{
       addToCart: function (itemName) {
           if (currentUserNameService.currentUserNameFunc() == "") {
               alert("You need to login before making a purchase");
               return;
           }
           var params = {"userName": currentUserNameService.currentUserNameFunc(), "itemName": itemName};
           $http.post("http://localhost:3000/users/addToCart", params).then(function (response) {
               alert("The item was added to the cart");
           });
       }
   }
});