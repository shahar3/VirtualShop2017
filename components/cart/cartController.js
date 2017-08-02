/**
 * Created by Yakir Hershkoviz on 02/08/2017.
 */
//cart controller
angular.module('myApp').controller('cartController',function ($scope, $http, $location,currentUserNameService,openPageService) {
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