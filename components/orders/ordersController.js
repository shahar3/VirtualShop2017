/**
 * Created by Yakir Hershkoviz on 02/08/2017.
 */
//order controller
angular.module('myApp').controller('orderController',function ($scope,$http,$location,openPageService,currentUserNameService) {
    var path = "http://localhost:3000/users/getThePreviousOrders" + "?userName=" + currentUserNameService.currentUserNameFunc();
    var params = {"username": currentUserNameService.currentUserNameFunc()};
    $http({
        url: path,
        method: "GET",
        params: params
    }).then(function (response) {
        $scope.teamsFirstCol = response.data.rows;
    });
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
   $scope.openPage = function (path) {
        openPageService.openPage(path);
   }
});
