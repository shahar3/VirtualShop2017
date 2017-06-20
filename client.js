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

app.controller('mainController', function ($scope, $http) {
    $http.get("http://localhost:3000/users/getLastEntry?userName=michal").then(function (response) {

            var jsonparse = JSON.parse(response);
            alert(response.count);
    });
});