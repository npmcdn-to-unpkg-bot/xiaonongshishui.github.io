$(document).ready(function(){
	// 滑动初始化
			
		$('#select').click(function(){
		$('.selectValue').show();
		var mySwiper = new Swiper('.swiper-container', {
		    direction: 'vertical',
		    centeredSlides:true,
		    slidesPerView : 5,
		    loop: true,
		    scrollbar:'.swiper-scrollbar',
		    scrollbarHide:'auto',
		    scrollbarDraggable:'true',
		    scrollbarSnapOnRelease:'true' ,
	  });
		});
		$('.selectValue a[title="confirm"]').click(function(){
			$('.controlGoal ul span').text($('.swiper-slide-active').text());
		});

	   });  