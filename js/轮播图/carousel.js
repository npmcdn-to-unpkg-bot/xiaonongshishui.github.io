;(function($){
	
	var Carousel = function(poster){
		//保存单个旋转木马对象
		this.poster = poster;//整个幻灯片区域
		this.posterItemMain = poster.find("ul.poster-list");
		this.nextBtn = poster.find("div.poster-next-btn");
		this.prevBtn = poster.find("div.poster-prev-btn");
		this.posterFirstItem = this.posterItemMain.find("li").eq(0);
		this.posterItems = poster.find("li").
		// alert(poster);
		this.settings = {
		width:1000,//幻灯片的宽度
		height:270,//幻灯片的高度
		posterWidth:640,//幻灯片第一帧的宽度
		posterHeight:270,//幻灯片第一帧的高度
		verticalAlign:"middle",
		scale:0.9,
		speed:500
	};
	$.extend(this.settings,this.getSettings())
	this.setSettingsValue();
	};
	Carousel.prototype = {
		//获取人工配置参数
		getSettings:function(){
			var settings = this.poster.data("setting");
			console.log(settings);
			if(settings && settings!={}){
				return settings;
			}else{
				return {};
			}
		},

		// 设置配置参数值去控制基本的宽度高度。。。
		setSettingsValue:function(){
			this.poster.css({
				width:this.settings.width,
				height:this.settings.height
			});
			this.posterItemMain.css({
				width:this.settings.posterWidth,
				height:this.settings.posterHeight
			});
			// 计算上下切换按钮的宽度
			var w = (this.settings.width - this.settings.posterWidth)/2;
			this.nextBtn.css({
				width:w,
				height:this.settings.height
			});
			this.prevBtn.css({
				width:w,
				height:this.settings.height
			});
			this.posterFirstItem.css({
				left:w
			});
		}
	};
	Carousel.init = function(posters){
		var _this_ = this;
		posters.each(function(i,elem){
			new _this_($(this));
		});
	};
	// 全局注册
	window["Carousel"] = Carousel;
})(jQuery);