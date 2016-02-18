$(document).ready(function(){			
		$('#select').click(function(){
		// 选择数值层出现
		$('.selectValue').show();
		// 滑动选择初始化
		var mySwiper = new Swiper('.swiper-container', {
		    direction: 'vertical',
		    centeredSlides:true,
		    slidesPerView : 5,
		    loop: true,
		    scrollbar:'.swiper-scrollbar',
		    scrollbarHide:'auto',
		    scrollbarDraggable:'true',
		    scrollbarSnapOnRelease:'true' , });
		//点击确定
			$('.selectValue a[title="confirm"]').click(function(){
			$(this).prev().text($('.swiper-slide-active').text());
		});

		});
		

	   });  