$(document).ready(function(){			
		$('i.select').click(function(){
			var option = this;
		// 选择数值层出现
		$('.selectValue').show();
		$('.selectValue header h3').text($(this).parents('li').children('strong').text());
		// 滑动选择初始化
		var mySwiper = new Swiper('.swiper-container', {
		    direction: 'vertical',
		    centeredSlides:true,
		    slidesPerView : 5,
		    loop: false,
		    scrollbar:'.swiper-scrollbar',
		    scrollbarHide:'auto',
		    scrollbarDraggable:'true',
		    scrollbarSnapOnRelease:'true' , });
		//点击确定
			$('.selectValue a[title="confirm"]').click(function(event){
			$(option).prev().text($('.swiper-slide-active').text());
			$('.selectValue').hide();
			event.preventDefault();
			option = null;
		});
			$('.selectValue a[title="cancle"]').click(function(event){
				$('.selectValue').hide();
				event.preventDefault();
				option = null;
			});

		});
		

	   });  