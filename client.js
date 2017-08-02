/**
 * Created by Yakir Hershkoviz on 20/06/2017.
 */
var app = angular.module('myApp', ['ngRoute']);

//app config
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "components/homePage/homePage.html",
            controller: "homePageImageController"
        })
        .when("/login", {
            templateUrl: "components/login/loginPage.html",
            controller: "loginController"
        }).when("/register", {
        templateUrl: "components/register/register.html",
        controller: "registerController"
    }).when("/items", {
        templateUrl: "components/items/itemsPage.html",
        controller: "itemsPageController"
    }).when("/cart",{
        templateUrl: "components/cart/cartPage.html",
        controller: "cartController"
    }).when("/orderPage",{
        templateUrl: "components/orders/orderPage.html",
        controller: "orderController"
    })
        .otherwise({
            redirect: '/',
        });
}]);

//cookie factory
app.factory('cookie',function () {
    return {

        set: function (name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            }
            else
                var expires = "";
            document.cookie = name + "=" + JSON.stringify(value) + expires + "; path=/";
        },

        get : function(name){
            var nameEQ = name + "=",
                ca = document.cookie.split(';');

            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0)
                    return  JSON.parse(c.substring(nameEQ.length,c.length));
            }

            return null;
        }

    }
});

//open page factory
app.factory('openPageService', function ($location) {
    return {
        openPage: function (url) {
            $location.path(url);
        }
    }
});

//current user name factory
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

//add to cart factory
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