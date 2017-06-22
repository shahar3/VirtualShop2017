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
    })
        .otherwise({
            redirect: '/',
        });
}]);

app.controller('loginController', function ($scope, $http, $location, openPageService) {
    $scope.onlyNumbers = /^\d+$/;
    $scope.checkDetailsOnClick = function () {
        var params = {"userName": $scope.userName, "password": $scope.password};
        $http.post("http://localhost:3000/users/login", params).then(function (response) {
            var data = response.data;
            alert("numberOfRows: " + data.numberOfRows);
            if (data.numberOfRows == 0) {
                alert("user name or password are incorrect");
            } else {
                openPageService.openPage('/');
                alert("the user are exist");
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
        alert(path);
        $http({
            url: path,
            method: "GET",
            params: params
        }).then(function (response) {
            $scope.securityQuestion = response.data;
            alert("securityQuestion: " + response.data.rows[0].securityQuestion);
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

app.controller('homePageImageController', function ($scope, $http, $location, openPageService) {
    $http.get("http://localhost:3000/items/getTopFive").then(function (response) {
        $scope.img_url = response.data;
        $scope.img_url1 = response.data;
        $scope.img_url2 = response.data;
        $scope.img_url3 = response.data;
        $scope.img_url4 = response.data;
        $scope.img_url5 = response.data;
    });
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
});

app.controller('itemsPageController', function ($scope, $http, $location) {
    $http({
        url: "http://localhost:3000/items/getItems",
        method: "GET",
    }).then(function (response) {
        $scope.teamsFirstCol = response.data.rows;
    })
        .then(function () {
            var userName = "dani";
            var param = {"username": userName};
            var path = "http://localhost:3000/items/recommendedItems";
            $http({
                url: path,
                method: "GET",
                params: param
            }).then(function (response) {
                alert("ok");
                alert(response.data.rows[0].userName);
            })
        });
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
            "securityQuestion": $scope.securityQuestion,
            "securityAnswer": $scope.securityAnswer
        }
        $http.post("http://localhost:3000/users/register", params).then(function (response) {
            var data = response.data;
            alert(data.numberOfRows);
            if (data.numberOfRows > 0) {
                alert("You have signed up");
                openPageService.openPage('/login');
            } else {
                alert("There was a problem, please try again");
            }
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


