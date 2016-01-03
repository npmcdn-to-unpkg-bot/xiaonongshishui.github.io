var bannerCount;
var n;
$(document).ready(function(){
	//下拉菜单
	$('.mainMenu>li:nth-child(2)').mouseenter(function(){
		$(this).find('ul').slideDown();
	}).mouseleave(function(){
		$(this).find('ul').slideUp();
	});
	// banner部分
	bannerCount = $('#img_div li').length;
	$('#img_div li:not(:first-child)').hide();
	$('#slide_cir li').click(function(){
		var i = $(this).index();
		$('#img_div li').filter(':visible').fadeOut(500).parent().children().eq(i).fadeIn(1000);
		//当前页对应圆点
		$(this).addClass('on');
		$(this).siblings().removeClass();
	});	
	var t = setInterval('showAuto()',3000);
	$('.content_banner').hover(function(){clearInterval(t);},function(){clearInterval(t);
   t = setInterval(showAuto,3000);});
	
	// 学员展示部分
	var $stuShow = $('#stu_show_content');
	var stuShowCount = $stuShow.find('li').length;//学员总数
	var stuShowWidth = $('.stu_show').width();//学员展示区域宽度
	var page = 1;
	var stuPerPage = 4;//每个版面的学员数
	var showPages = Math.ceil(stuShowCount/stuPerPage);
	$('.next').click(function(){
		if(!$stuShow.is(':animated')){
			if(page==showPages){
				$stuShow.animate({left:'0px'},'normal');
				page = 1;
			}
			else{
				$stuShow.animate({left:'-='+stuShowWidth},'normal');
				page++;
			}
		}
		//学员展示区圆点
		$('.stu_slide').find('div').eq(page-1).addClass('on').siblings().removeClass('on');
	});
	$('.prev').click(function(){
		if(!$stuShow.is(':animated')){
			if(page==1){
				$stuShow.animate({left:'-='+stuShowWidth*(showPages-1)},'normal');
				page = showPages;
			}
			else{
				$stuShow.animate({left:'+='+stuShowWidth},'normal');
				page--;
			}
		}
		//学员展示区圆点
		$('.stu_slide').find('div').eq(page-1).addClass('on').siblings().removeClass('on');
	});
});
// 自动轮播
function showAuto(){
	n = n<(bannerCount-1)?++n : 0;
	$('#slide_cir li').eq(n).trigger('click');
}

