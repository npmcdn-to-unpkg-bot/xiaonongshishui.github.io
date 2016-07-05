angular.module('paidan.controllers', [])
    .controller('HomeCtrl', ['$scope', 'HomeService', 'LocalDatabase', 'HttpService','CameraService','Host','RemoteInterface', function ($scope, HomeService, LocalDatabase, HttpService,CameraService,Host,RemoteInterface) {
        $scope.geo = {
            type: 3,
            accuracy: 0,
            interval: 10000
        };
        $scope.start = function () {
            HomeService.startMonitor($scope.geo.type, $scope.geo.accuracy, $scope.geo.interval);
        };
        $scope.stop = function () {
            HomeService.stopMonitor();
        };
        $scope.logOut = function () {
            HttpService.signOut();
        };
        $scope.$on("$ionicView.enter", function () {
            $scope.user = LocalDatabase.get(LocalDatabase.Data.user);
        });
        $scope.uploadAvatar=function(){
            CameraService.uploadAvatar(Host+RemoteInterface.UploadAvatar+'.do','strFileName',{id:$scope.user.id}).then(function(data){
                console.log(data);
                var i;
                for(i in data){
                    $scope.user[i] =data[i];
                }
                LocalDatabase.set(LocalDatabase.Data.user,$scope.user);
            });
        };
        $scope.doRefresh=function(){

        }
    }])
    .controller('LoginCtrl', ['$scope', 'LoginService','$ionicHistory', function ($scope, LoginService,$ionicHistory) {
        $scope.user = LoginService.user();
        $scope.$on("$ionicView.enter", function () {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
        });
        $scope.login = function () {
            LoginService.login($scope.user.cellphone, $scope.user.password, $scope.user.remember);
        };
    }])
    .controller('AccountCtrl', ['$scope', '$rootScope', 'AccountService', function ($scope, $rootScope, AccountService) {
        $scope.edit=false;
        $scope.toggle=function(){
            $scope.edit=!$scope.edit;
        };
        AccountService.getData().then(function (data) {
            $scope.user = data;
        });
        $scope.save = function () {
            AccountService.changeData($scope.user).then(function () {
                $rootScope.$ionicGoBack();
            });
        }
    }])
    .controller('PasswordCtrl', ['$scope', '$rootScope', 'PasswordService', function ($scope, $rootScope, PasswordService) {
        $scope.data = {};
        $scope.resetPassword = function () {
            PasswordService.resetPassword($scope.data).then(function () {
                $rootScope.$ionicGoBack();
            });
        };
    }])
    .controller('PictureCtrl', ['$scope', '$rootScope', 'PasswordService', function ($scope, $rootScope, PasswordService) {

    }]);
