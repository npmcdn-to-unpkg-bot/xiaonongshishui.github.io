$(document).ready(function(){
	$('.directions a').click(function(){
		$(this).addClass('on').parent().siblings().find('a').removeClass('on');
	});
	//下拉菜单
	$('.mainMenu>li:nth-child(2)').mouseenter(function(){
		$(this).find('ul').slideDown();
	}).mouseleave(function(){
		$(this).find('ul').slideUp();
	});
});

