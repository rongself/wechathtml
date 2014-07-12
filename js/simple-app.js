$(function(){

	//Function to Fix Pages Height
	function fixPagesHeight() {
		$('.swiper-pages').css({
			height: $(window).height()
		})
        var wheight = $(window).height();
        var wwidth = $(window).width();
        //$('img.content-img').width(wwidth).height(wheight);
	}
	$(window).on('resize',function(){
		fixPagesHeight()
	})
	fixPagesHeight()

	//Init Pages
	var pages = $('.swiper-container').swiper({
        mode: 'vertical',
        freeMode: false,
        freeModeFluid: false,
        onSlideChangeEnd:function(item){
            if(item.activeIndex == $('.bg-img').length-1){
                $('.up').fadeOut(300);
            }else{
                if(!$('.up').is(':visible')){
                    $('.up').fadeIn(300);
                }
            }
        }

    });

    document.getElementsByClassName('touch-layer')[0].addEventListener('touchstart',function(){
        if(bgm.paused){
            $(this).children('#soundControl').addClass('jump');
            bgm.play();
        }else{
            $(this).children('#soundControl').removeClass('jump');
            bgm.pause();
        }
    },false);

})