
/*
 定时器
 */
var timer1;

var myLocation = {
    
    /*
     函数名称：startLocation
     函数作用：开启持续定位
     参数说明：successfulBack    定位成功回调方法，例 function successfulBack(id){}，id 为回调成功返回的信息
     failureBack       定位失败回调方法，例 function failureBack(error){}, error 为错误信息
     type               获取类型 0：location（坐标） 1：address(详细地址) 2：city(城市) 3：all(坐标加详细地址)
     accuracy           获取坐标精度  例：kCLLocationAccuracyBest;
     参数：   0：kCLLocationAccuracyBest;  //最近的距离
     1：kCLLocationAccuracyNearestTenMeters;  //十米
     2：kCLLocationAccuracyHundredMeters;     //百米
     3：kCLLocationAccuracyKilometer;         //千米
     4：kCLLocationAccuracyThreeKilometers;   //三千米
     interval           获取定位信息时间间隔 1000 = 1秒
     
     注1：type与accuracy参数，填写对应的数字即可
     注2：当type 为 0(坐标)、3(坐标加详细地址) 时，successfulBack 回调方法返回参数为数组，即：0.[latitude,longitude]  3.[latitude,longitude,assress]
     */
    startLocation: function (successfulBack,failureBack,type,accuracy,interval){
        
        function getLocation(){
            cordova.exec(successfulBack,
                         failureBack,
                         "SYLocationManager",
                         "startOrStop",
                         [type,
                          accuracy]);
        }
        
        window.clearInterval(timer1);
        timer1 = window.setInterval(getLocation,interval);
        var timer2 = window.setInterval("getLocation()",interval);
        getLocation();
    },
    
    /*
     函数名称：stopLocation
     函数作用：停止持续定位
     参数说明：无
     */
    stopLocation: function (){
        window.clearInterval(timer1);
        cordova.exec(function(){},
                     function(){},
                     "SYLocationManager",
                     "startOrStop",
                     []);
    }
};



module.exports = myLocation;


