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
            })
            .otherwise({
                redirect: '/',
            });
    }]);

    app.controller('loginController', function ($scope, $http, $location) {
        $scope.checkDetailsOnClick = function () {
            alert("checkDetailsOnClick");
            var params = {"userName": $scope.userName, "password": $scope.password};
            $http.post("http://localhost:3000/users/login", params).then(function (response) {
                var data = response.data;
                alert("numberOfRows: " + data.numberOfRows);
                if (data.numberOfRows == 0) {
                    alert("user name or password are incorrect");
                } else {
                    $location.path('/');
                }
                $scope.test = response.data;
            });
        }
    });

    app.controller('testC', function () {
        $scope.check = function () {
            alert("check");
        }
    });

    app.controller('homePageController', function ($scope, $http, $location) {
        alert("homepageController");
        $scope.openLoginPage = function () {
            $location.path('/login');
        }

    });

    app.controller('homePageImageController', function ($scope, $http, $location) {
        $http.get("http://localhost:3000/items/getTopFive").then(function (response) {
            $scope.img_url = response.data;
            $scope.img_url1 = response.data;
            $scope.img_url2 = response.data;
            $scope.img_url3 = response.data;
            $scope.img_url4 = response.data;
            $scope.img_url5 = response.data;
        });
        // $scope.signInDisplay = checkLogInUser.checkLogIn;
        $scope.displayLoginPage = function () {
            $location.path('/login');
        }
    });

    app.factory('checkLogInUser', function (logIn) {
        alert("inFactoryy");
        let service = {};
        service.isLoggedIn = logIn;
        return service;
        var checkLogIn = function () {
          return service;
        };
    });