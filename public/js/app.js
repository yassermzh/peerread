var app = angular.module('app',['ngGrid']);

app.run(function ($http,$rootScope,$location){
  window.rootScope = $rootScope;
  console.log('path=%s,host=%s',$location.path(),$location.host());
  // $rootScope.user='';
  // var logout = function(){
  //   $http.post('/logout').success(function(data, status, headers, config) {
  //     $rootScope.user='';
  //     $location.path('/');
  //   });
  // };

  // $rootScope.logout = logout;
  // $(window).load(function() {
  // $(".loader").fadeOut("slow");
// })
});


app.factory("FlashService", function($rootScope) {
  return {
    show: function(message) {
      $rootScope.flash = message;
    },
    clear: function() {
      $rootScope.flash = "";
    }
  };
});

app.factory("SessionService", function() {
  return {
    get: function(key) {
      return sessionStorage.getItem(key) || false;
    },
    set: function(key, val) {
      return sessionStorage.setItem(key, val);
    },
    unset: function(key) {
      return sessionStorage.removeItem(key);
    }
  };
});


app.factory("AuthenticationService", function($http, $q, $timeout, $location, $rootScope, SessionService, FlashService) {

  // var auth = {'authenticated': false, 'user':''};
  // $rootScope.auth = {
  //   'authenticated': SessionService.get('authenticated'),
  //   'user':SessionService.get('user')
  // };

  var cacheSession   = function(user) {
    console.log('cacheSession is called...');
    // $rootScope.auth={ authenticated : true, user :user};
    SessionService.set('authenticated', true);
    SessionService.set('user', user);
  };

  var uncacheSession = function() {
    // $rootScope.auth={ authenticated : false, user :'' };
    SessionService.unset('authenticated');
    SessionService.unset('user');
  };

  var loginError = function(response) {
    // FlashService.show(response.flash);
    FlashService.show("error login");
  };

  var sanitizeCredentials = function(credentials) {
    return credentials;
    // return {
      // username: $sanitize(credentials.username),
      // password: $sanitize(credentials.password),
      // csrf_token: CSRF_TOKEN
    // };
  };

  return {
    // auth: auth,
    whoAmI: function() {
      return SessionService.get('user');
    },
    login: function(credentials) {
      var login = $http.post("/auth/login", sanitizeCredentials(credentials));
      login.success(function(){cacheSession(credentials.username);});
      login.success(FlashService.clear);
      login.error(loginError);
      return login;
    },
    logout: function() {
      var logout = $http.get("/auth/logout");
      logout.success(uncacheSession);
      return logout;
    },
    isLoggedIn: function() {
      return SessionService.get('authenticated');
    },
    checkLoggedin: function(){
    //   // Initialize a new promise
      var deferred = $q.defer();
    //   // console.log('checkLoggedin called...');

    //   // Make an AJAX call to check if the user is logged in
      var loggedin = $http.get('/auth/loggedin');
      loggedin.success(function(user){
        // Authenticated
        if (user !== '0')
          $timeout(deferred.resolve, 0);
        // Not Authenticated
        else {
          uncacheSession()
          FlashService.show('You need to log in.');
          $timeout(function(){console.log('not authed, deferreing...'); deferred.reject()}, 1000);
          $location.path('/login');
        }
      });
      return loggedin.promise;
    }
  };
});


app.factory('MUtils', [function () {

  return {
    copyContents : function (from, to) {
      for (var e in from) {
        to[e]=from[e];
      }
    }
  };
}]);



app.config(function($routeProvider, $locationProvider) {

  // $httpProvider.responseInterceptors.push(function($q, $location) {
  //   return function(promise) {
  //     return promise.then(
  //       // Success: just return the response
  //       function(response){
  //         return response;
  //       },
  //       // Error: check the error status to get only the 401
  //       function(response) {
  //         if (response.status === 401)
  //           $location.url('/login');
  //         return $q.reject(response);
  //       }
  //     );
  //   };
  // });

  $locationProvider.html5Mode(true);  // to remove # from urls, cause problem with IE<10

  $routeProvider
  .when('/', {
    controller:'gridCtrl',
    templateUrl:'/partials/grid'
  })
  .when('/carousel', {
    controller:'testCtrl',
    templateUrl:'/partials/carousel',
    resolve: {
      delay: function($q, $timeout) {
        var delay = $q.defer();
        console.log('wait for the promise to get resolved');
        $timeout(function(){
          var fuckPack={
            data: "fuckDataisFuckingFuck",
            fuck: function(name){return name+" is a fucker...";}
          };
          console.log('now resolved...');
          // delay.resolve(fuckPack);
          delay.reject(fuckPack);   // in this case the it will not routed to /carousel however the html is fetched
        }, 3000);
        return delay.promise;
      }
    }
  })
  .when('/detail/vuln/:vulnSrc/:vulnId', {
    controller:'detailViewCtrl',
    templateUrl:'/partials/detail-view'
  })
  .when('/admin', {
    controller:'adminVulns',
    templateUrl:'/partials/admin',
    resolve: {
      loggedin: function(AuthenticationService){
        return AuthenticationService.checkLoggedin();
      }
    }
  })
  .when('/login',{
    controller:'login',
    templateUrl: '/partials/login'
  })
  .when('/stats',{
    controller:'stats',
    templateUrl: '/partials/stats',
  })
  .otherwise({
    redirectTo:'/'
  });

  
});

app.directive('tooltip', function () {
    return {
        restrict:'A',
        link: function(scope, element, attrs)
        {
            console.log('tooltip called....'+attrs.tooltip);
            $(element)
                .attr('title',scope.$eval(attrs.tooltip))
                .tooltip({placement: "top"});
        }
    };
});

