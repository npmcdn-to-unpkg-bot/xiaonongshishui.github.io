$(document).ready(function(){
	   	// 滑动初始化
	   	var mySwiper = new Swiper ('.swiper-container', {
		    direction: 'vertical',
		    centeredSlides:true,
		    slidesPerView : 5,
		    loop: true,
		    scrollbar:'.swiper-scrollbar',
		    scrollbarHide:'auto',
		    scrollbarDraggable:'true',
		    scrollbarSnapOnRelease:'true' ,
		    // onSlideChangeStart: function(swiper){
      // 			// 中间框中字体变大
	   		// 	$('.swiper-slide-active').animate({fontSize:"22px"});
    		// }
	  });
	   });  