/**
 * Created by Yakir Hershkoviz on 02/08/2017.
 */
//items controller
angular.module('myApp').controller('itemsPageController', function ($scope, $http, $location,currentUserNameService,openPageService,addToCartService) {
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