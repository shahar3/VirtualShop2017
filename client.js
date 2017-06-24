/**
 * Created by Yakir Hershkoviz on 20/06/2017.
 */
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
    })
        .otherwise({
            redirect: '/',
        });
}]);

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
            $http.post("")
        });
    }
});

app.controller('testC', function () {
    $scope.check = function () {
        alert("check");
    }
});

app.controller('homePageController', function ($scope, $http, $location, openPageService) {
    $scope.openLoginPage = function () {
        openPageService.openPage('/login');
    }

});

app.controller('homePageImageController', function ($scope, $http, $location, openPageService,currentUserNameService,addToCartService) {
    $http.get("http://localhost:3000/items/getTopFive").then(function (response) {
        $scope.img_url = response.data;
        $scope.img_url1 = response.data;
        $scope.img_url2 = response.data;
        $scope.img_url3 = response.data;
        $scope.img_url4 = response.data;
        $scope.img_url5 = response.data;
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
        alert("add to cart " + itemName);
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
        userName
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

app.controller('cartController',function ($scope, $http, $location,currentUserNameService) {
    var params = {"userName": currentUserNameService.currentUserNameFunc()};
    $http({
        url:"http://localhost:3000/users/displayTheCartItems",
        method:"GET",
        params:params
    }).then(function (response) {
        // alert(response.data.totalCartPrice);
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
    };
    $scope.sortBy = function (sortBy) {
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

app.factory('addToCartService',function (currentUserNameService) {
   return{
       addToCart: function (itemName) {
           alert("addToCartService " + itemName);
           alert(currentUserNameService.currentUserNameFunc());
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