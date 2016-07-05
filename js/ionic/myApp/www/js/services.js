angular.module('paidan.constants', [])
    .constant('Host', 'http://api.520xinjia.cn/bee/v1')
    .constant('LocalData', {
        user: 'user',
        monitor:'monitor'
    })
    .constant('RemoteInterface', {
        Login: '/login',//登录
        PostLatLng: '/sendinfo',//发送坐标
        Logout: '/signout',//退出登录
        Account: '/getme',//获取个人信息
        ChangeAccount: '/alter',//修改个人信息
        UploadAvatar: '/beeUploadImg',//上传头像
    });
angular.module('paidan.services', [])
    /*数据存储接口*/
    .factory("LocalDatabase", ['LocalData', function (LocalData) {
        return {
            Data: LocalData,
            get: function (key) {
                var value = localStorage.getItem(key);
                if (value !== null && value !== undefined && value.length > 0)
                    return JSON.parse(value);
                else
                    return null;
            },
            set: function (key, value) {
                if (value !== null && value !== undefined)
                    localStorage.setItem(key, JSON.stringify(value));
            },
            remove: function (key) {
                var value = this.get(key);
                if (value !== null && value !== undefined)
                    localStorage.removeItem(key);
                return value;
            }
        };
    }])
    /*远程数据访问接口*/
    .factory("HttpService", ['$http', 'Host', '$q', '$ionicPopup', 'RemoteInterface', "$ionicLoading", '$state', '$ionicHistory', function ($http, Host, $q, $ionicPopup, RemoteInterface, $ionicLoading, $state, $ionicHistory) {
        var toParam = function (obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

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
                }
                else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };
        var service = {
            RemoteInter: RemoteInterface,
            get: function (url, params, forbid) {
                return service.httpMethod(true, url, params, forbid);
            },
            httpMethod: function (isGet, url, params, forbid) {
                var deferer = $q.defer();
                console.log("url:----" + url);
                console.log(params);
                if (forbid !== null && forbid !== undefined && forbid) {
                    $ionicLoading.show({
                        template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner>'
                    });
                }
                var httpPromise = null;
                if (isGet)
                    httpPromise = $http.get(Host + url + ".do?" + toParam(params));
                else
                    httpPromise = $http.post(Host + url + ".do", params);
                httpPromise.success(function (data) {
                    console.log("back-----");
                    console.log(data);
                    if (data.code == "0") {
                        deferer.resolve(data.data);
                    } else {
                        $ionicPopup.alert({
                            title: "提示",
                            template: '<div class="list"><div class="card item-icon-left"><i class="icon ion-ios-email"></i>' + data.message + '</div></div>',
                        }).then(function () {
                            deferer.reject();
                            if (data.code == "2") {
                                service.signOut();
                            }
                        });
                    }
                }).error(function (response, code) {
                    deferer.reject(response);
                    if ($ionicPopup._popupStack.length === 0)
                        if (code == 500)
                            $ionicPopup.alert({
                                title: "网络",
                                template: "服务器故障"
                            });
                        else
                            $ionicPopup.alert({
                                title: "提示",
                                template: "网络无法连接"
                            });
                }).finally(function () {
                    if (forbid !== null && forbid !== undefined && forbid) {
                        $ionicLoading.hide();
                    }
                });
                return deferer.promise;
            },
            signOut: function () {
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    historyRoot: true
                });
                this.get(this.RemoteInter.Logout);
                $state.go("login");
            },
            post: function (url, params, forbid) {
                return service.httpMethod(false, url, params, forbid);
            }
        };
        return service;
    }])
    //登录页面
    .factory('LoginService', ['HttpService', '$q', '$state', '$ionicPopup', 'LocalDatabase', '$ionicHistory',function (HttpService, $q, $state, $ionicPopup, LocalDatabase,$ionicHistory) {

        var service = {
            verify: function (name, password) {
                var nm = name || '',
                    psw = password || '';
                if (nm === '' || psw === '') {
                    $ionicPopup.alert({
                        title: '错误',
                        content: '用户名或密码不能为空!'
                    });
                } else {
                    return true;
                }
                return false;
            },
            login: function (name, password, remeber) {
                if (service.verify(name, password)) {
                    HttpService.post(HttpService.RemoteInter.Login, {
                        cellphone: name,
                        password: password
                    }, true).then(function (data) {
                        data.remember = remeber;
                        if(!data.avatar_url){
                            data.avatar_url='img/avatar.png';
                        }
                        if (remeber) {
                            data.password = password;
                        } else {
                            data.password = '';
                        }
                        LocalDatabase.set(LocalDatabase.Data.user, data);
                        $ionicHistory.nextViewOptions({
                            disableBack: true,
                            historyRoot: true
                        });
                        $state.go('home');
                    }, function (data) {
                    });
                }
            },
            user: function () {
                var obj = {
                    cellphone: '',
                    password: '',
                    remember: false
                };
                var user = LocalDatabase.get(LocalDatabase.Data.user);
                if (user) {
                    obj.cellphone = user.cellphone;
                    obj.password = user.password;
                    obj.remember = user.remember;
                }
                return obj;
            }
        };

        return service;

    }])
    //照相功能
    .factory('CameraService', ['HttpService', '$q', '$state', '$ionicPopup', 'LocalDatabase', '$ionicActionSheet', function (HttpService, $q, $state, $ionicPopup, LocalDatabase, $ionicActionSheet) {

        var service = {
            uploadAvatar: function (url, fileKey,params) {
                var deferred = $q.defer();
                $ionicActionSheet.show({
                    buttons: [
                        {text: '拍照'}
                    ],
                    titleText: '选择照片',
                    cancelText: '取消',
                    cancel: function () {
                    },
                    buttonClicked: function (index) {
                        if (index === 0) {
                            taskPicture();
                        }
                        return true;
                    }
                });
                function uploadPic(imageURI) {
                    var win = function (r) {
                        var response = JSON.parse(r.response);
                        console.log(response);
                        if (response.code === '0') {
                            deferred.resolve(response.data);
                        }
                        console.log("Code = " + r.responseCode);
                        console.log("Response = " + r.response);
                        console.log("Sent = " + r.bytesSent);
                    };

                    var fail = function (error) {
                        $ionicPopup.alert({
                            title: '错误',
                            content: '上传失败'
                        });
                        deferred.reject(error);
                        console.log("An error has occurred: Code = " + error.code);
                        console.log("upload error source " + error.source);
                        console.log("upload error target " + error.target);
                    };

                    var options = new FileUploadOptions();
                    options.fileKey = fileKey;
                    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                    options.mimeType = "image/jpeg";
                    options.params = params;

                    var ft = new FileTransfer();
                    ft.upload(imageURI, url, win, fail, options);
                }

                function taskPicture() {
                    if (!navigator.camera) {
                        $ionicPopup.alert({
                            title: '错误',
                            content: '请在真机环境中使用拍照上传。'
                        });
                        return;
                    }
                    var options = {
                        quality: 75,
                        targetWidth: 600,
                        targetHeight: 400,
                        saveToPhotoAlbum: false
                    };

                    navigator.camera.getPicture(onSuccess, onFail, options);
                    function onSuccess(imageData) {
                        uploadPic(imageData);
                    }

                    function onFail(message) {
                        console.log('Failed because: ' + message);
                    }
                }

                return deferred.promise;
            }
        };

        return service;

    }])
    //定位功能
    //.factory('LatlngService', ['HttpService', '$q', '$state', '$ionicPopup', 'LocalDatabase', '$ionicActionSheet', function (HttpService, $q, $state, $ionicPopup, LocalDatabase, $ionicActionSheet) {
    //
    //    var service = {
    //        start:function(){
    //
    //        }
    //    };
    //
    //    return service;
    //
    //}])
    //主页面
    .factory('HomeService', ['HttpService', 'LocalDatabase', '$window','$q', function (HttpService, LocalDatabase, $window,$q) {
        var myData={time:10000,flag:0};
        var startData={lat:'',lng:'',address:''};
        var service={
            startMonitor: function (type, accuracy,interval) {
                var success=null,
                    error=null,
                    time=1000;
                if(device.platform ==='iOS'){
                    if ($window.myLocation) {
                        success=function (data) {
                            var nData={
                                lat: data[0] + '',
                                lng: data[1] + '',
                                address: data[2]+''
                            };
                            console.log(nData);
                            service.post(nData);
                            if(time!=interval){
                                time=interval;
                                $window.myLocation.startLocation(success, error, type, accuracy, time);
                            }
                        };
                        error=function (data) {
                            console.log('get location is error==========================');
                            console.log(data);
                        };
                        $window.myLocation.startLocation(success, error, type, accuracy, time);
                    }
                } else if(device.platform ==='Android') {
                    if($window.BaidubackgroundLocation){
                        $window.BaidubackgroundLocation.receiveMessageInAndroidCallback=function(lat,lng){
                            console.log({lat:lat+'',lng:lng+'',address:'天津'});
                            service.post({lat:lat+'',lng:lng+'',address:'天津'});
                            if(time!=interval){
                                time=interval;
                                $window.BaidubackgroundLocation.start(function(a){console.log(a)},function(a){console.log(a)},type,accuracy,time);
                            }
                        };
                        $window.BaidubackgroundLocation.start(function(a){console.log(a)},function(a){console.log(a)},type,accuracy,time);
                    }
                }
            },
            stopMonitor: function () {
                if(device.platform ==='iOS'){
                    if ($window.myLocation) {
                        $window.myLocation.stopLocation(success, error);
                        function success(data) {
                            console.log('stop location is success==========================');
                            console.log(data);
                        }

                        function error(data) {
                            console.log('stop location is error==========================');
                            console.log(data);
                        }
                    }
                } else if(device.platform === 'Android') {
                    $window.BaidubackgroundLocation.stop(function(a){console.log(a)});
                }
            },
            post: function (data) {
                var deferred=$q.defer();
                HttpService.post(HttpService.RemoteInter.PostLatLng, {
                    id: LocalDatabase.get(LocalDatabase.Data.user).id,
                    lat:data.lat,
                    lng:data.lng,
                    address:data.address
                }).then(function(d1){
                    deferred.resolve(d1);
                },function(d2){
                    deferred.reject(d2)
                });
                return deferred.promise;
            }
        };
        return service;
    }])
//个人信息页面
    .factory('AccountService', ['LocalDatabase', 'HttpService', '$q', function (LocalDatabase, HttpService, $q) {
        return {
            getData: function () {
                var deferred = $q.defer(),
                    oUser = LocalDatabase.get(LocalDatabase.Data.user),
                    i;
                HttpService.post(HttpService.RemoteInter.Account, {id: oUser.id}).then(function (data) {
                    for (i in data) {
                        oUser[i] = data[i];
                    }
                    LocalDatabase.set(LocalDatabase.Data.user, oUser);
                    deferred.resolve(oUser);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            changeData: function (data) {
                var deferred = $q.defer(),
                    oUser = LocalDatabase.get(LocalDatabase.Data.user),
                    i;
                HttpService.post(HttpService.RemoteInter.ChangeAccount, data).then(function (data) {
                    for (i in data) {
                        oUser[i] = data[i];
                    }
                    LocalDatabase.set(LocalDatabase.Data.user, oUser);
                    deferred.resolve(oUser);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }

        };
    }])
    //修改密码页面
    .factory('PasswordService', ['LocalDatabase', 'HttpService', '$q', '$ionicPopup', function (LocalDatabase, HttpService, $q, $ionicPopup) {
        return {
            resetPassword: function (data) {
                var deferred = $q.defer();
                var oUser = LocalDatabase.get(LocalDatabase.Data.user);
                if (!data.password1 || !data.password2 || !data.password) {
                    $ionicPopup.alert({
                        title: '错误',
                        content: '输入不能为空'
                    });
                } else if (data.password1 != data.password2) {
                    $ionicPopup.alert({
                        title: '错误',
                        content: '两次输入不一致'
                    });
                } else {
                    HttpService.post(HttpService.RemoteInter.Login, {
                        cellphone: oUser.cellphone,
                        password: data.password
                    })
                        .then(function () {
                            HttpService.post(HttpService.RemoteInter.ChangeAccount, {
                                id: oUser.id,
                                password: data.password1
                            })
                                .then(function (data1) {
                                    if (oUser.remember) {
                                        oUser.password = data.password1;
                                        LocalDatabase.set(LocalDatabase.Data.user, oUser);
                                    }
                                    $ionicPopup.alert({
                                        title: '修改密码成功',
                                        content: '您的新密码为' + data.password1
                                    });
                                    deferred.resolve(data1);
                                });
                        });
                }
                return deferred.promise;
            }
        };
    }]);
