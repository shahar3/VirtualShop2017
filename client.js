/**
 * Created by Yakir Hershkoviz on 20/06/2017.
 */
var app = angular.module('myApp', ['ngRoute']);
//app config
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/homePage.html",
            controller: "mainController"
        })
        .when("/login", {
            templateUrl: "views/login.html",
            controller: "loginController"
        })
        .when("/cities", {
            templateUrl: "views/cities.html",
            controller: 'citiesController'
        })
        .otherwise({
            redirect: '/',
        });
}]);

app.controller('mainController',function ($scope,$http) {
    $scope.checkDetailsOnClick = function () {
        var params = {"userName":$scope.userName,"password":$scope.password};
        $http.post("http://localhost:3000/users/login",params).then(function (response) {
            var data = response.data;
            alert("numberOfRows: " + data.numberOfRows);
            if(data.numberOfRows == 0){
                alert("user name or password are incorrect");
            }else{
                alert("done");
            }
           $scope.test = response.data;
        });
    }
});

app.controller('testController', function ($scope, $http) {
    $http.get("http://localhost:3000/users/getLastEntry?userName=michal").then(function (response) {
        $scope.test = response.data;
    });
});