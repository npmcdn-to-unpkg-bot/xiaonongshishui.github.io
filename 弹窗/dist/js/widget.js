// define(function(){
// function Widget(Obj){
// 	this.handlers={};
// }
// Widget.prototype.on = function(type, handler){
// 	if(typeof this.handlers[type]=='undefined'){
// 		this.handlers[type]=[];
// 	}
// 	this.handlers[type].push(handler);
// 	return this;
// };
// Widget.prototype.fire = function(type, data){
// 	if (this.handlers[type] instanceof Array) {
// 		var i,handlers=this.handlers[type];
// 		for(i=0;i<handlers.length;i++){
// 			handlers[i](data);
// 		}
// 	}
// 	return this;
// };
// return {
// 	"Widget":Widget
// };
// });

define(['jquery'],function($){
	function Widget(){
		this.boudingBox = null; //属性：最外层容器
	}
	Widget.prototype.on = function(type, handler){
		if(typeof this.handlers[type]=='undefined'){
			this.handlers[type]=[];
		}
		this.handlers[type].push(handler);
		return this;
	};
	Widget.prototype.fire = function(type, data){
		if (this.handlers[type] instanceof Array) {
			var i,handlers=this.handlers[type];
			for(i=0;i<handlers.length;i++){
				handlers[i](data);
			}
		}
		return this;
	};
	Widget.prototype.render = function (container) {
		this.renderUI();
		this.handlers = {};
		this.bindUI();
		this.syncUI();
		$(container || document.body).append(this.boundingBox);
	};
	Widget.prototype.destroy = function () {
		this.destructor();
		this.boudingBox.off();
		this.boudingBox.remove();
	};
	Widget.prototype.renderUI = function () {};
	Widget.prototype.bindUI = function () {};
	Widget.prototype.syncUI = function () {};
	Widget.prototype.destructor = function () {};
	return {
		"Widget":Widget
	};
});


// define(['jquery'],function($){
// 	function Widget(){
// 		this.boudingBox = null; //属性：最外层容器
// 	}
// 	Widget.prototype={
// 		on:function(type,handler){
// 			if (typeof this.handlers[type]=='undefined') {
// 				this.handlers[type]=[];
// 			}
// 			this.handlers[type].push(handler);
// 			return this;
// 		},
// 		fire:function(type,data){
// 			if (this.handlers[type] instanceof Array) {
// 				var handlers = this.handlers[type];
// 				for(var i=0,len=handlers.length;i<len;i++){
// 					handlers[i](data);
// 				}
// 			}
// 		},
// 		render:function(container){		//方法：渲染组件
// 			this.renderUI();
// 			this.handlers={};
// 			this.bindUI();
// 			this.syncUI();
// 			$(container||document.body).append(this.boudingBox);
// 		},
// 		destroy:function(){		 //方法：渲染组件
// 			this.destructor();
// 			this.boudingBox.off();
// 			this.boudingBox.remove();
// 		},
// 		renderUI:function(){},	//接口：添加dom节点
// 		bindUI:function(){},	//接口：监听事件
// 		syncUI:function(){},	//接口：初始化组件属性
// 		destructor:function(){} //接口：销毁前的处理函数
// 	};
// 	return{
// 		Widget:Widget
// 	};
// });