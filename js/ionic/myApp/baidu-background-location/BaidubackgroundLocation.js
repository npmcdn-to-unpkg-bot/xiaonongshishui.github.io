var exec = require('cordova/exec');

exports.start=function(successCallback, errorCallback,type,accuracy,interval) {
        exec(successCallback, errorCallback, 'BaidubackgroundLocation', 'start', [type,accuracy,interval]);
    };

exports.stop = function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'BaidubackgroundLocation', 'stop', []);
    };  