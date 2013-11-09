angular.module('app').controller('login', function($scope, $location, AuthenticationService) {
    
    $scope.credentials = {'username':'', 'password':''};
    $scope.submit = function(){
        AuthenticationService.login($scope.credentials).success(function(){
            $location.path('/admin');
        });
    };

});