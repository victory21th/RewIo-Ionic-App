var server_addr = 'http://stage.rew.io';

angular.module('starter.controllers', [])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', '$location', 'globalInfoInstance', '$http', '$ionicLoading', '$state', '$ionicSideMenuDelegate', '$ionicHistory', function($scope, $ionicModal, $timeout, $location, globalInfoInstance, $http, $ionicLoading, $state, $ionicSideMenuDelegate, $ionicHistory) {
  
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.userId = 0;
    $scope.userName = '';
    $scope.userPhoto = '';
    $scope.userPhone = '';
    $scope.userEmail = '';

    // Form data for the login modal
    $scope.loginData = {};

    // Form data for the register modal
    $scope.registerData = {};

    // Form data for the profile modal
    $scope.profileData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.registerModal = modal;
    });



    // Create the profile modal that we will use later
    $ionicModal.fromTemplateUrl('templates/profile.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.profileModal = modal;
    });


    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Triggered in the register modal to close it
    $scope.closeRegister = function() {
        $scope.registerModal.hide();
    };

    // Triggered in the profile modal to close it
    $scope.closeProfile = function() {
        $scope.profileModal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Open the register modal
    $scope.register = function() {
        $scope.registerModal.show();
    };

    // Open the profile modal
    $scope.profile = function() {
        $scope.profileData.name = $scope.userName;
        $scope.profileData.email = $scope.userEmail;
        $scope.profileData.phone = $scope.userPhone;

        $scope.profileModal.show();
    };

    // Perform the logout action when the user click the Sign Out menu
    $scope.doLogOut = function() {
        $scope.userId = 0;
        $scope.userName = '';
        $scope.userPhoto = '';
        $scope.userPhone = '';

        globalInfoInstance.setUserId(0);
        globalInfoInstance.setUserName('');
        globalInfoInstance.setUserPhone('');
        globalInfoInstance.setUserPhoto('');

        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $state.go("app.playlists");
    };


    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);


        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var dataObject =
        {
            _token : 'df53ca268240ca76670c8566ee54568a',
            email : $scope.loginData.email,
            password : $scope.loginData.password
        };

        $http({
            method: 'POST',
            url: server_addr + '/api/v1/user/login',
            data: dataObject,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .success(function(data, status, headers, config) {
            $ionicLoading.hide()
            if( data ) {
                if (data.result == 'success') {
                    globalInfoInstance.setUserId(data.user_id);
                    globalInfoInstance.setUserName(data.name);
                    globalInfoInstance.setUserPhoto(data.photo);
                    globalInfoInstance.setUserPhone(data.phone);

                    $scope.userId = data.user_id;
                    $scope.userName = data.name;
                    $scope.userPhoto = data.photo;
                    $scope.userPhone = data.phone;
                    $scope.userEmail = data.email;

                    $scope.closeLogin();


                }else {
                    alert ('Login Failed!. Please try again with correct email and password.');
                }
            }
            else {
            }
        })
        .error(function(data, status, headers, config) {
            $ionicLoading.hide()
            console.log(status);
        });
    };


    // Perform the update profile action when the user submits the profile form
    $scope.doUpdate = function() {
        if (!$scope.profileData.name) {
            alert ('Please input the name');
            return;
        }

        if (!$scope.validateEmail($scope.profileData.email)) {
            alert ('Please input the valid email address');
            return;
        }

        console.log('Doing update', $scope.profileData);


        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var dataObject =
        {
            _token : 'df53ca268240ca76670c8566ee54568a',
            email :  $scope.profileData.email,
            password : $scope.profileData.password,
            name : $scope.profileData.name,
            phone : $scope.profileData.phone,
            user_id : $scope.userId

        };

        $http({
            method: 'POST',
            url: server_addr + '/api/v1/user/updateProfile',
            data: dataObject,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .success(function(data, status, headers, config) {
            $ionicLoading.hide()
            if( data ) {
                if (data.result == 'success') {

                    $scope.userName  = $scope.profileData.name;
                    $scope.userPhone = $scope.profileData.phone;
                    $scope.userEmail = $scope.profileData.email;

                    alert ('Profile information updated successfully.');

                    $scope.closeRegister();


                }else {
                    alert (data.msg);
                }
            }
            else {
            }
        })
        .error(function(data, status, headers, config) {
            $ionicLoading.hide()
            console.log(status);
        });

    }


    // Perform the register action when the user submits the register form
    $scope.doRegister = function() {
        if (!$scope.registerData.name) {
            alert ('Please input the name');
            return;
        }

        if (!$scope.validateEmail($scope.registerData.email)) {
            alert ('Please input the valid email address');
            return;
        }

        if (!$scope.registerData.password) {
            alert ('Please input the password');
            return;
        }

        if ($scope.registerData.password != $scope.registerData.confirmPassword) {
            alert ('Password does not match!');
            return;
        }


        console.log('Doing register', $scope.registerData);


        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var dataObject =
        {
            _token : 'df53ca268240ca76670c8566ee54568a',
            email :  $scope.registerData.email,
            password : $scope.registerData.password,
            password_confirmation : $scope.registerData.confirmPassword,
            name : $scope.registerData.name,
            phone : $scope.registerData.phone
        };

        $http({
            method: 'POST',
            url: server_addr + '/api/v1/user/signup',
            data: dataObject,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .success(function(data, status, headers, config) {
            $ionicLoading.hide()
            if( data ) {
                if (data.result == 'success') {

                    alert ('Registered Successfully!. Please login with your account.');

                    $scope.closeResiger();


                }else {
                    alert (data.msg);
                }
            }
            else {
            }
        })
        .error(function(data, status, headers, config) {
            $ionicLoading.hide()
            console.log(status);
        });
    };

    $scope.showSearchView = function(view) {
        globalInfoInstance.setSearchByCategory(false);
        $location.path(view);
    }


    $scope.validateEmail = function(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }
}])

.controller('PlaylistsCtrl', function($scope, $http, $ionicLoading, $rootScope) {

    $scope.storeLists = {};

    $scope.init = function() {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });


        var dataObject =
        {
            _token : 'df53ca268240ca76670c8566ee54568a'
        };

        $http({
            method: 'POST',
            url: server_addr + '/api/v1/store/featured',
            data: dataObject,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .success(function(data, status, headers, config) {
            $ionicLoading.hide()
            if( data ) {
                $scope.storeLists = data.stores;
            }
            else {
            }
        })
        .error(function(data, status, headers, config) {
            $ionicLoading.hide()
            console.log(status);
        });
    };

    $rootScope.$on("$ionicView.enter", function(scopes, states) {
        $scope.init();
    });
})

.controller('PlaylistCtrl', ['$scope', '$stateParams', '$ionicLoading', '$http', '$compile', '$ionicScrollDelegate', '$location', '$ionicSideMenuDelegate', 'globalInfoInstance',  function($scope, $stateParams, $ionicLoading, $http, $compile, $ionicScrollDelegate, $location, $ionicSideMenuDelegate, globalInfoInstance) {

    $scope.myrating = {};
    $scope.types = {};
    $scope.userId = globalInfoInstance.getUserId();

    $ionicSideMenuDelegate.canDragContent(false);

    $scope.scrollTo = function (id) {
        $location.hash(id);
        var delegateHandle = $ionicScrollDelegate.$getByHandle('myContent');
        delegateHandle.anchorScroll(id);
    };


    // Get Store Detail Info
    $scope.getStoreDetail = function() {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var storeId = $stateParams.playlistId;

        var dataObject =
        {
            _token : 'df53ca268240ca76670c8566ee54568a',
            store_id : storeId
        };

        if (globalInfoInstance.getUserId() != 0) {
            dataObject = {
                _token : 'df53ca268240ca76670c8566ee54568a',
                store_id : storeId,
                user_id : globalInfoInstance.getUserId()
            };
        }

        $http({
            method: 'POST',
            url: server_addr + '/api/v1/store/detail',
            data: dataObject,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .success(function(data, status, headers, config) {
            $ionicLoading.hide()
            if( data ) {

                $scope.store= data;

                var keywords = [];
                var keycount = 0;

                data.categories.forEach(function(item) {
                    keywords[keycount] = item.name;
                    keycount ++;
                });

                $scope.keywords = keywords;
                $scope.offerCount = data.service.offers.length;
                $scope.loyaltyCount = data.service.loyalties.length;
                $scope.reviewCount = data.reviews.length;


                var myLatlng = new google.maps.LatLng(data.lat, data.lng);

                var mapOptions = {
                    center: myLatlng,
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById("map"),
                    mapOptions);

                //Marker + infowindow + angularjs compiled ng-click
                var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
                var compiled = $compile(contentString)($scope);

                var infowindow = new google.maps.InfoWindow({
                    content: compiled[0]
                });

                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: 'Uluru (Ayers Rock)'
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map,marker);
                });

                $scope.map = map;
            }
            else {
            }
        })
        .error(function(data, status, headers, config) {
            $ionicLoading.hide()
            console.log(status);
        });
    };

    $scope.getStoreDetail();


    // Get Review Type Info
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var storeId = $stateParams.playlistId;
    var dataObject =
    {
        _token : 'df53ca268240ca76670c8566ee54568a',
        store_id : storeId
    };

    $http({
        method: 'POST',
        url: server_addr + '/api/v1/store/reviewTypes',
        data: dataObject,
        headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
    .success(function(data, status, headers, config) {
        $ionicLoading.hide()
        if( data ) {
            if (data.result == 'success') {
                $scope.types = data.types;
            }else {
                alert (data.msg);
            }
        }
        else {
        }
    })
    .error(function(data, status, headers, config) {
        $ionicLoading.hide()
        console.log(status);
    });


    //Give Feedback Functioni
    $scope.giveFeedback = function() {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var ratings = [];
        var keyArray = Object.keys($scope.myrating);
        for (i = 0; i < keyArray.length - 1; i ++) {
            var rating = {
                type_id : keyArray[i],
                answer : $scope.myrating[keyArray[i]]
            };
            ratings[i] = rating;
        }

        dataObject =
        {
            _token : 'df53ca268240ca76670c8566ee54568a',
            store_id : storeId,
            user_id : $scope.userId,
            description : $scope.myrating.note,
            ratings : ratings,
        };

        $http({
            method: 'POST',
            url: server_addr + '/api/v1/user/giveReview',
            data: dataObject,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .success(function(data, status, headers, config) {
            $ionicLoading.hide()
            if( data ) {
                if (data.result == 'success') {
                    $scope.getStoreDetail();
                }else {
                    alert (data.msg);
                }
            }
            else {
            }
        })
        .error(function(data, status, headers, config) {
            $ionicLoading.hide()
            console.log(status);
        });
    };
}])

.controller('SearchCategoryCtrl', function($scope, $http) {

    var dataObject =
    {
        _token : 'df53ca268240ca76670c8566ee54568a'
    };

    $scope.init = function() {
        $http({
            method: 'POST',
            url: server_addr + '/api/v1/categories',
            data: dataObject,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .success(function(data, status, headers, config) {
            if( data ) {

                var cdata = [];
                var count = 0;

                data.categories.forEach(function(item) {

                    cdata[count] = item.name;
                    count ++;

                    item.sub_categories.forEach(function(subItem) {
                        cdata[count] = subItem.name;
                        count ++;
                    });
                });

                $scope.categories = cdata;
            }
            else {
            }
        })
        .error(function(data, status, headers, config) {
            console.log(status);
        });
    }
})


.controller('SearchCityCtrl', function($scope, $http) {

    var dataObject =
    {
        _token : 'df53ca268240ca76670c8566ee54568a'
    };

    $scope.init = function() {
        $http({
            method: 'POST',
            url: server_addr + '/api/v1/cities',
            data: dataObject,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .success(function(data, status, headers, config) {
            if( data ) {

                var cdata = [];
                var count = 0;

                data.cities.forEach(function(item) {
                    cdata[count] = item.name;
                    count ++;
                });

                $scope.cities = cdata;
            }
            else {
            }
        })
        .error(function(data, status, headers, config) {
            console.log(status);
        });
    }
})


.controller('SearchMenuCtrl', ['$scope', '$http', '$location', 'globalInfoInstance', function($scope, $http, $location, globalInfoInstance) {

    var dataObject =
    {
        _token : 'df53ca268240ca76670c8566ee54568a'
    };

    $scope.init = function() {
        console.log('Initialize SearchMenuCtrl Here');
        $http({
            method: 'POST',
            url: server_addr + '/api/v1/categories',
            data: dataObject,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .success(function(data, status, headers, config) {
            if( data ) {

                var items = [];
                var count = 0;
                var subCount = 0;

                data.categories.forEach(function(item) {

                    subCount = 0;
                    var subItems = [];

                    item.sub_categories.forEach(function(subItem) {

                        var sub_category = {
                            title : subItem.name
                        };

                        subItems[subCount] = sub_category;
                        subCount ++;
                    });

                    var category = {
                        id : 'menu' + count,
                        title : item.name,
                        subItems: subItems
                    };

                    items[count] = category;

                    count ++;
                });

                $scope.items = items;
            }
            else {
            }
        })
        .error(function(data, status, headers, config) {
            console.log(status);
        });
    };

    $scope.showSearchView = function(view, param) {
        globalInfoInstance.setSearchByCategory(true);
        globalInfoInstance.setSearchCategory(param);
        $location.path(view);
    }
}])

.controller('SearchCtrl', ['$scope', '$http', 'globalInfoInstance', '$ionicLoading',  '$compile', '$ionicSideMenuDelegate', function($scope, $http, globalInfoInstance, $ionicLoading, $compile, $ionicSideMenuDelegate) {


    $ionicSideMenuDelegate.canDragContent(false);

    var keyword = globalInfoInstance.getCategory();
    var location = globalInfoInstance.getCity();

    if (globalInfoInstance.getSearchByCategory()) {
        keyword = globalInfoInstance.getSearchCategory();
    }

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });


    var dataObject =
    {
        _token : 'df53ca268240ca76670c8566ee54568a',
        keyword : keyword,
        location : location
    };

    $http({
        method: 'POST',
        url: server_addr + '/api/v1/store/search',
        data: dataObject,
        headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
    .success(function(data, status, headers, config) {

        $ionicLoading.hide();

        if( data ) {
            $scope.storeLists = data.stores;
            $scope.searchCount = data.stores.length;

            $scope.list = true;
            $scope.map = false;

            var store = [];
            var searchCount = 0;

            data.stores.forEach(function(item) {
                var store_item = {
                    lat : item.lat,
                    lng : item.lng,
                    name : item.name,
                    rating : item.rating,
                    openTime : item.opening_time,
                    phone : item.phone
                };
                store[searchCount] = store_item;
                searchCount ++;
            });

            if (searchCount > 0) {
                var myLatlng = new google.maps.LatLng(store[0].lat, store[0].lng);

                var mapOptions = {
                    center: myLatlng,
                    zoom: 13,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var map = new google.maps.Map(document.getElementById("map"),
                    mapOptions);


                for (i = 0; i < searchCount; i ++) {

                    var latLng = new google.maps.LatLng(store[i].lat, store[i].lng);

                    //Marker + infowindow + angularjs compiled ng-click
                    var contentString = "<div><div><b>" + store[i].name + "</b></div><rating ng-model='store[" + i + "].rating' max='5' class='map-store-rating'></rating><div style='font-size: 11px;'><i class='fa-phone'></i> " + store[i].phone + "</div><div style='font-size: 11px;'>Today: " + store[i].openTime + "</div></div>";
                    var compiled = $compile(contentString)($scope);

                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: map,
                        title: store[i].name
                    });

                    marker.info = new google.maps.InfoWindow({
                        content: compiled[0]
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        this.info.open(map,this);
                    });
                }

                $scope.map = map;
            }


        }
        else {
        }
    })
    .error(function(data, status, headers, config) {
        console.log(status);
    });


    $scope.showList = function(obj) {

        var bObj = document.getElementById("a-list");
        if (bObj.className.toLowerCase().indexOf('active') > 0) return;


        var cObj = document.getElementById("list");
        cObj.className = cObj.className.replace(/\bng-hide\b/,'');

        var oObj = document.getElementById("searchMap");
        oObj.className = oObj.className + ' ng-hide';

        google.maps.event.trigger( map, 'resize' );

        var aObj = document.getElementById("a-map");
        aObj.className = aObj.className.replace(/\bactive\b/,'');


        bObj.className = bObj.className + ' active';
    };

    $scope.showMap = function(obj) {

        var bObj = document.getElementById("a-map");
        if (bObj.className.toLowerCase().indexOf('active') > 0) return;

        var cObj = document.getElementById("searchMap");
        cObj.className = cObj.className.replace(/\bng-hide\b/,'');

        var oObj = document.getElementById("list");
        oObj.className = oObj.className + ' ng-hide';

        google.maps.event.trigger( map, 'resize' );

        var aObj = document.getElementById("a-list");
        aObj.className = aObj.className.replace(/\bactive\b/,'');


        bObj.className = bObj.className + ' active';

    };
}])


.controller('CartCtrl', ['$scope', '$http', 'globalInfoInstance', '$ionicLoading',  '$compile', '$ionicSideMenuDelegate', function($scope, $http, globalInfoInstance, $ionicLoading, $compile, $ionicSideMenuDelegate) {


    $ionicSideMenuDelegate.canDragContent(false);

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });


    var dataObject =
    {
        _token : 'df53ca268240ca76670c8566ee54568a',
        user_id : globalInfoInstance.getUserId()
    };

    $http({
        method: 'POST',
        url: server_addr + '/api/v1/user/cart',
        data: dataObject,
        headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
    .success(function(data, status, headers, config) {

        $ionicLoading.hide();

        if( data ) {
            if (data.result == 'success') {
                $scope.storeLists = data.stores;
                $scope.searchCount = data.stores.length;

                $scope.list = true;
                $scope.map = false;

                var store = [];
                var searchCount = 0;

                data.stores.forEach(function(item) {
                    var store_item = {
                        lat : item.lat,
                        lng : item.lng,
                        name : item.name,
                        rating : item.rating,
                        openTime : item.opening_time,
                        phone : item.phone
                    };
                    store[searchCount] = store_item;
                    searchCount ++;
                });

                if (searchCount > 0) {
                    var myLatlng = new google.maps.LatLng(store[0].lat, store[0].lng);

                    var mapOptions = {
                        center: myLatlng,
                        zoom: 13,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = new google.maps.Map(document.getElementById("map"),
                        mapOptions);


                    for (i = 0; i < searchCount; i ++) {

                        var latLng = new google.maps.LatLng(store[i].lat, store[i].lng);

                        //Marker + infowindow + angularjs compiled ng-click
                        var contentString = "<div><div><b>" + store[i].name + "</b></div><rating ng-model='store[" + i + "].rating' max='5' class='map-store-rating'></rating><div style='font-size: 11px;'><i class='fa-phone'></i> " + store[i].phone + "</div><div style='font-size: 11px;'>Today: " + store[i].openTime + "</div></div>";
                        var compiled = $compile(contentString)($scope);

                        var marker = new google.maps.Marker({
                            position: latLng,
                            map: map,
                            title: store[i].name
                        });

                        marker.info = new google.maps.InfoWindow({
                            content: compiled[0]
                        });

                        google.maps.event.addListener(marker, 'click', function() {
                            this.info.open(map,this);
                        });
                    }

                    $scope.map = map;
                }
            }else {
                alert (data.msg);

            }
        }
        else {
        }
    })
    .error(function(data, status, headers, config) {
        console.log(status);
    });


    $scope.showList = function(obj) {

        var bObj = document.getElementById("a-list");
        if (bObj.className.toLowerCase().indexOf('active') > 0) return;


        var cObj = document.getElementById("list");
        cObj.className = cObj.className.replace(/\bng-hide\b/,'');

        var oObj = document.getElementById("searchMap");
        oObj.className = oObj.className + ' ng-hide';

        google.maps.event.trigger( map, 'resize' );

        var aObj = document.getElementById("a-map");
        aObj.className = aObj.className.replace(/\bactive\b/,'');


        bObj.className = bObj.className + ' active';
    };

    $scope.showMap = function(obj) {

        var bObj = document.getElementById("a-map");
        if (bObj.className.toLowerCase().indexOf('active') > 0) return;

        var cObj = document.getElementById("searchMap");
        cObj.className = cObj.className.replace(/\bng-hide\b/,'');

        var oObj = document.getElementById("list");
        oObj.className = oObj.className + ' ng-hide';

        google.maps.event.trigger( map, 'resize' );

        var aObj = document.getElementById("a-list");
        aObj.className = aObj.className.replace(/\bactive\b/,'');


        bObj.className = bObj.className + ' active';

    };
}])