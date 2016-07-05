// 倒计时
		function CountDown(dateObj,domArr,callback){
			this.hour = dateObj.hour || 0;
			this.min = dateObj.min;
			this.sec = dateObj.sec;
			this.mil = dateObj.mil || 0;
			this.domArr = domArr;
			this.callback = callback || "";
		}
		CountDown.prototype.countFromMil =function(){
			var _this = this;
			var timer = setInterval(function(){
				if(_this.mil > 30){
					_this.mil -= 30; 
				}else{
					if(_this.min || _this.sec){
						_this.mil = _this.mil >0 ?(1000 + _this.mil - 30):1000;
					}else{
						_this.mil = 0;
					}
					if(_this.sec){
						_this.sec--;
					}else{
						if(_this.min){
							_this.sec = 59;
							_this.min--;
						}
					}
				}
					_this.minStr = _this.min<10 ?"0"+_this.min:_this.min;
					_this.secStr = _this.sec<10 ?"0"+_this.sec:_this.sec;
					_this.milStr = (parseInt(_this.mil/10))<10 ?"0"+parseInt(_this.mil/10):parseInt(_this.mil/10);
					$(_this.domArr[0]).text(_this.minStr);
					$(_this.domArr[1]).text(_this.secStr);
					$(_this.domArr[2]).text(_this.milStr);
					if(_this.mil == 0&&_this.sec == 0&&_this.min == 0){
					clearInterval(timer);
					if(typeof _this.callback ){_this.callback();}
			}},30);
		};
		CountDown.prototype.countFromSec = function(){
			var _this = this;
			var timer = setInterval(function(){
					if(_this.sec){
						console.log("111"+_this.sec)
						_this.sec--;
					}else{
						_this.sec = 59;
						if(_this.min){
							console.log("111"+_this.min)
							_this.min--;
						}else{
							if(_this.hour){
								_this.hour--;
							}
						}
					}
					_this.hourStr = _this.hour<10 ?"0"+_this.hour:_this.hour;
					_this.minStr = _this.min<10 ?"0"+_this.min:_this.min;
					_this.secStr = _this.sec<10 ?"0"+_this.sec:_this.sec;
					$(_this.domArr[0]).text(_this.hourStr);
					$(_this.domArr[1]).text(_this.minStr);
					$(_this.domArr[2]).text(_this.secStr);
					if(_this.sec == 0&&_this.min == 0&&_this.hour == 0){
					clearInterval(timer);
					if(typeof _this.callback ){_this.callback();}
				}
				},1000);
				
		}