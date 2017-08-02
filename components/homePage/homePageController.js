/**
 * Created by Yakir Hershkoviz on 02/08/2017.
 */
//home page controller
angular.module('myApp').controller('homePageImageController', function ($scope, $http, $location, openPageService,cookie,currentUserNameService,addToCartService) {
    $http.get("http://localhost:3000/items/getTopFive").then(function (response) {
        $scope.teamsFirstCol = response.data.rows;
        $http.get("http://localhost:3000/items/getNewItemsLastMonth").then(function(response){
            $scope.teamsRecCol = response.data.rows;
            checkCookie();
        });
    });
    //check for cookie
    function checkCookie() {
        var cookieValue = cookie.get('loginCookie!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        if (cookieValue != null) {
            alert("cookie detected");
            var params = {"userName": cookieValue.userName, "password": cookieValue.password};
            alert("params: " + cookieValue.userName + " | " + cookieValue.password);
            $http.post("http://localhost:3000/users/login", params).then(function (response) {
                var data = response.data;
                if (data.numberOfRows == 0) {
                    alert("user name or password are incorrect");
                } else {
                    alert("in the else");
                    currentUserNameService.updateCurrentUserName(cookieValue.userName);
                    currentUserNameService.updaeLastEntry(response.data.rows[0].lastEntry);
                    $scope.afterUserSignIn = true;
                    $scope.userSignIn = true;
                    $scope.currentUser = currentUserNameService.currentUserNameFunc();
                    $scope.lastEntry = currentUserNameService.currentLastEntry();
                    openPageService.openPage('/');
                }
            });
        }
    }
    if(currentUserNameService.currentUserNameFunc()==""){
        $scope.userSignIn = false;
        $scope.afterUserSignIn = false;
    }else{
        $scope.afterUserSignIn = true;
        $scope.userSignIn = true;
        $scope.currentUser = currentUserNameService.currentUserNameFunc();
        $scope.lastEntry = currentUserNameService.currentLastEntry();
    }
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
    $scope.addToCart = function (itemName) {
        addToCartService.addToCart(itemName);
        // if(currentUserNameService.currentUserNameFunc() == ""){
        //     alert("You need to login before making a purchase");
        //     return;
        // }
        // var params = {"userName":currentUserNameService.currentUserNameFunc(),"itemName": itemName };
        // $http.post("http://localhost:3000/users/addToCart",params).then(function (response) {
        //     alert("The item was added to the cart");
        // });
    }
});