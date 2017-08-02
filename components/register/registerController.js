/**
 * Created by Yakir Hershkoviz on 02/08/2017.
 */
//register controller
angular.module('myApp').controller('registerController', function ($scope, $http, $location, openPageService,cookie) {
    //read xml file
    $scope.countries = [];
    function doxml() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "countries.xml", false);
        xmlhttp.send();
        var xmldata = xmlhttp.responseXML;
        var x = xmldata.getElementsByTagName("Country");
        for(var i = 0; i < x.length; i++) {
            $scope.countries.push(x[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue);
        }
    }
    doxml();
    // if(!xmlData){
    //     xmlData = (new DOMParser()).parseFromString(xml.responseText,'text/xml');
    //     var emp = xmlData.getElementsByTagName("Countries");
    // var firstCountry = xmlData.data.getElementsByTagName("ID");
    // alert(firstCountry[0]);
    // alert(firstCountry);
    // var firstCountry = emp.getElementsByTagName("NAME")[0].firstChild.data;
    //     alert(firstCountry);
    // }
    $scope.backToHomePage = function () {
        openPageService.openPage('/');
    };
    $scope.addUser = function () {
        var x = document.getElementById("contriesSelect");
        var strCountry = x.options[x.selectedIndex].value;
        strCountry = strCountry.substring(7);
        var params = {
            "userName": $scope.userName,
            "city": $scope.city,
            "password": $scope.password,
            "email": $scope.email,
            "country": strCountry,
            "address": $scope.address,
            "phone": $scope.phone,
            "firstName": $scope.firstName,
            "lastName": $scope.lastName,
            "cellular": $scope.cellular,
            "creditCardNumber": $scope.creditCardNumber,
            "favouriteTeam": $scope.favoriteTeam,
            "favouriteCategories": $scope.favoriteCategories,
            "securityQuestion": $scope.securityQuestion,
            "securityAnswer": $scope.securityAnswer
        }
        $http.post("http://localhost:3000/users/register", params).then(function (response) {
            var data = response.data;
            if (data.numberOfRows > 0) {
                alert("You have signed up");
                //
                //create cookie
                cookie.set('loginCookie',{userName:params.userName,password:params.password},30);
                openPageService.openPage('/login');
            } else {
                alert("There was a problem, please try again");
            }
        });
    };
});