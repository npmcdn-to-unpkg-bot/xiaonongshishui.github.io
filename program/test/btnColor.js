// 16进制颜色转换成rgb颜色
String.prototype.colorRgb = function(){
	//十六进制颜色值的正则表达式 
	var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	var color = this.toLowerCase();
	if(color && reg.test(color)){
		// 3位颜色值转换为6位颜色值
		if(color.length === 4){
			var colorNew = "#";
			for(var i = 1;i<4;i++){
				colorNew += color.slice(i,i+1).concat(color.slice(i,i+1));
			}
		}
		// 处理6位颜色值
		var colorChange = [];
		for(var j = 1;j<7;j+=2){
			colorChange.push(parseInt("0x" + color.slice(i,i+2)));
		}
		return "RGB("+colorChange.join(",")+")";
	}
	else {
		return color;
	}  
}
// 点击按钮时颜色变化
function btnColorChange(className){
	var btn = $("."+className);
	if(btn){
		btn.each(function(){
		$this = $(this);
		var bgColor = $this.css("background-color");
		var bgColorRgb = bgColor.colorRgb();
		var rgbReg = /(?:||rgb|RGB)*/g;
		var bgColorArr = bgColorRgb.replace(rgbReg,"").split(",");
		var r = bgColorArr[0].replace("(","");
		var g = bgColorArr[1];
		var b = bgColorArr[2].replace(")","");
		r = parseInt(parseFloat(r) * 0.8);
		g = parseInt(parseFloat(g) * 0.8);
		b = parseInt(parseFloat(b) * 0.8);
		var bgColorNew = "rgb("+r + "," +g + "," + b+")";
		if($this.attr("class").indexOf("bg") != -1){
				var classArr = $this.attr("class").split(" ");
				for(var i = 0;i<classArr.length;i++){
					if(classArr[i].indexOf("bg") != -1){
						var bgClass =  classArr[i];
						break;
					}
				}
			}
			$this.attr("data-bgclass",bgClass);
			$this.attr("data-bgcolornew",bgColorNew);
			$this.attr("data-bgcolor",bgColor);
	});
		btn.mousedown(function(){
			if($(this).attr("data-bgclass")){
				$(this).removeClass($(this).attr("data-bgclass"));
			}
			$(this).css("background-color",$(this).attr("data-bgcolornew"));
		});
		btn.mouseup(function(){
			if($(this).attr("data-bgclass")){
				$(this).addClass($(this).attr("data-bgclass"));
			}
			$(this).css("background-color",$(this).attr("data-bgcolor"));
		});
	}	
}
$(function(){
	btnColorChange("btn");
	btnColorChange("nav-btn-log");
	btnColorChange("nav-btn-reg");
});
