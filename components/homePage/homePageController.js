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
        var cookieValue = cookie.get('loginCookie');
        if (cookieValue != null) {
            var params = {"userName": cookieValue.userName, "password": cookieValue.password};
            $http.post("http://localhost:3000/users/login", params).then(function (response) {
                var data = response.data;
                if (data.numberOfRows == 0) {
                    alert("user name or password are incorrect");
                } else {
                    currentUserNameService.updateCurrentUserName(cookieValue.userName);
                    currentUserNameService.updaeLastEntry(response.data.rows[0].lastEntry);
                    $scope.afterUserSignIn = true;
                    $scope.userSignIn = true;
                    $scope.currentUser = currentUserNameService.currentUserNameFunc();
                    var lastEntry = currentUserNameService.currentLastEntry();
                    var subLastEntry = lastEntry.substring(0,10);
                    $scope.lastEntry = subLastEntry;
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
        var lastEntry = currentUserNameService.currentLastEntry();
        var subLastEntry = lastEntry.substring(0,10);
        $scope.lastEntry = subLastEntry;

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
    }
    $scope.displayAboutPage = function () {
        var myWindow = window.open("","aboutWindow","width=500,height=400");
        myWindow.document.write("In this work we used many important technologies both server-side and client-side. " +
            "Working with Angular Technology greatly simplified the work."+
        "The main difficulty was in understanding the principles of services." +
        "Another challenge was designing the site.");
    }
});