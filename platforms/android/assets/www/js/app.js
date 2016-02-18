// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic.rating'])

.directive('catautoComplete',['$http', 'globalInfoInstance', function($http, globalInfoInstance){
    return {
        restrict:'AE',
        scope:{
            categoires:'=categoryInfo'
        },
        templateUrl:'templates/category-autocomplete-template.html',
        link:function(scope,elem,attrs){
            scope.suggestions=[];
            scope.selectedIndex=-1; //currently selected suggestion index

            scope.search=function(){

                if (scope.searchCategory == '') {
                    scope.suggestions = [];
                }else {
                    if (scope.categoires.length > 0) {

                        var cdata = [];
                        var count = 0;

                        scope.categoires.forEach(function(item) {
                            if (item.toLowerCase().indexOf(scope.searchCategory.toLowerCase()) > -1) {
                                cdata[count]  = item;
                                count ++;
                            }
                        });

                        scope.suggestions=cdata;
                        scope.selectedIndex=-1;
                    }
                }
            }


            scope.addToSelectedTags=function(index){
                scope.searchCategory= scope.suggestions[index];
                globalInfoInstance.setCategory( scope.searchCategory);
                scope.suggestions=[];
            }

            scope.$watch('selectedIndex',function(val){
                if(val!==-1) {
                    scope.searchCategory = scope.suggestions[scope.selectedIndex];
                }
            });
        }
    }
}])


.directive('cityautoComplete',['$http', 'globalInfoInstance', function($http, globalInfoInstance){
    return {
        restrict:'AE',
        scope:{
            cities:'=cityInfo'
        },
        templateUrl:'templates/city-autocomplete-template.html',
        link:function(scope,elem,attrs){
            scope.suggestions=[];
            scope.selectedIndex=-1; //currently selected suggestion index

            scope.search=function(){

                if (scope.searchCity == '') {
                    scope.suggestions = [];
                }else {
                    if (scope.cities.length > 0) {

                        var cdata = [];
                        var count = 0;

                        scope.cities.forEach(function(item) {
                            if (item.toLowerCase().indexOf(scope.searchCity.toLowerCase()) > -1) {
                                cdata[count]  = item;
                                count ++;
                            }
                        });

                        scope.suggestions=cdata;
                        scope.selectedIndex=-1;
                    }
                }
            }


            scope.addToSelectedTags=function(index){
                scope.searchCity= scope.suggestions[index];
                globalInfoInstance.setCity( scope.searchCity);
                scope.suggestions=[];
            }

            scope.$watch('selectedIndex',function(val){
                if(val!==-1) {
                    scope.searchCity = scope.suggestions[scope.selectedIndex];
                }
            });
        }
    }
}])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller: 'SearchCtrl'
      }
    }
  })

  .state('app.cart', {
      url: "/cart",
      views: {
          'menuContent': {
              templateUrl: "templates/cart.html",
              controller: 'CartCtrl'
          }
      }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.playlists.signout', {
      url: "/playlists/:signOut",
      views: {
          'menuContent': {
              templateUrl: "templates/playlists.html"
          }
      }
  })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
})

.service('globalInfoInstance', function(){
    var category = '';
    var city = '';
    var searchCategory = '';
    var searchByCategory = 0;


    //user data
    var user_id = 0;
    var user_name = '';
    var user_phone = '';
    var user_photo = '';

    return {

        //set parameters
        setCategory: function ( param ) {
            category = param;
        },
        setCity: function ( param ) {
            city = param;
        },
        setSearchCategory: function ( param ) {
            searchCategory = param;
        },
        setSearchByCategory: function( param ) {
            searchByCategory = param;
        },
        setUserId: function (param) {
            user_id = param;
        },
        setUserName: function (param) {
            user_name = param;
        },
        setUserPhone: function (param) {
            user_phone = param;
        },
        setUserPhoto: function (param) {
            user_photo = param;
        },


        //get parameteres
        getCategory: function () {
            return category;
        },
        getCity: function () {
            return city;
        },
        getSearchCategory: function() {
            return searchCategory;
        },
        getSearchByCategory: function() {
            return searchByCategory;
        },
        getUserId: function() {
            return user_id;
        },
        getUserPhone: function() {
            return user_phone;
        },
        getUserPhoto: function() {
            return user_photo;
        },
        getUserName: function() {
            return user_name;
        }
    };
});
