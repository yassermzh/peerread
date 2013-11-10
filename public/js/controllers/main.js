angular.module('app').controller('main', function($scope, $location, AuthenticationService, FlashService) {

    // $scope.user='';
    // $scope.user=AuthenticationService.howAmI();
    // $scope.$watch(AuthenticationService.auth,function(){
    //     $scope.user=AuthenticationService.whoAmI();
    // });
    
    window.mainScope = $scope;
    $scope.$location = $location;


    $scope.authService = AuthenticationService;


    $scope.logout = function(){
        AuthenticationService.logout().success(function(){
            FlashService.show('Logged out successfully.');
            $location.path('/');
        });
    };
    $scope.login = function(){
        $location.path('/login');
    };

    
});