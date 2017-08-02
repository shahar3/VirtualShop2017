/**
 * Created by Yakir Hershkoviz on 02/08/2017.
 */
//login controller
angular.module('myApp').controller('loginController', function ($scope, $http, $location, openPageService,currentUserNameService) {
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
            //$http.post("")
        });
    }
});