/**
 * Created by Yakir Hershkoviz on 20/06/2017.
 */
var app = angular.module('myApp', ['ngRoute']);
//app config
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/homePage.html",
            controller: "homePageController"
        })
        .when("/login", {
            templateUrl: "views/loginPage.html",

        })
        .when("/cities", {
            templateUrl: "views/cities.html",
            controller: 'citiesController'
        })
        .otherwise({
            redirect: '/',
        });
}]);

app.controller('loginController',function ($scope,$http,$location) {
    $scope.checkDetailsOnClick = function () {
        alert("checkDetailsOnClick");
        var params = {"userName":$scope.userName,"password":$scope.password};
        $http.post("http://localhost:3000/users/login",params).then(function (response) {
            var data = response.data;
            alert("numberOfRows: " + data.numberOfRows);
            if(data.numberOfRows == 0){
                alert("user name or password are incorrect");
            }else{
                $location.path('/');
            }
           $scope.test = response.data;
        });
    }
});

app.controller('testC',function () {
    $scope.check = function () {
        alert("check");
    }
});

app.controller('homePageController',function ($scope,$http,$location) {
    $scope.openLoginPage = function () {
        $location.path('/login');
    }
});