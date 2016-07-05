angular.module('paidan', ['ionic', 'paidan.controllers', 'paidan.services','paidan.constants','ngCordova'])
    .config(function ($httpProvider,$ionicConfigProvider) {
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.withCredentials = true;


        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function (data) {
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function (obj) {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;

                for (name in obj) {
                    value = obj[name];

                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };

            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];

        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.backButton.text('返回').icon('ion-ios-arrow-left');
    })
    .run(function ($ionicPlatform,$cordovaStatusbar,$timeout) {
        $ionicPlatform.ready(function () {
            $cordovaStatusbar.overlaysWebView(true);
            // styles: Default : 0, LightContent: 1, BlackTranslucent: 2, BlackOpaque: 3
            $cordovaStatusbar.style(1);

            // supported names: black, darkGray, lightGray, white, gray, red, green,
            // blue, cyan, yellow, magenta, orange, purple, brown
            $cordovaStatusbar.styleHex('#db4537');
            $cordovaStatusbar.show();
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            $timeout(function(){
                navigator.splashscreen.hide();
            },2000);
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                controller:'HomeCtrl'
            })
            .state('account', {
                url: '/home/account',
                templateUrl: 'templates/account.html',
                controller:'AccountCtrl'
            })
            .state('login', {
                url:'/login',
                templateUrl:'templates/login.html',
                controller:'LoginCtrl'
            })
            .state('password', {
                url:'/password',
                templateUrl:'templates/psw.html',
                controller:'PasswordCtrl'
            })
            .state('picture', {
                url:'/picture',
                templateUrl:'templates/picture.html',
                controller:'PictureCtrl'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });
