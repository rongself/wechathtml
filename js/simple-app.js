$(function(){

	//Function to Fix Pages Height
	function fixPagesHeight() {
		$('.swiper-pages').css({
			height: $(window).height()
		})
        var wheight = $(window).height();
        var wwidth = $(window).width();
        $('img.content-img').width(wwidth).height(wheight);
	}
	$(window).on('resize',function(){
		fixPagesHeight()
	})
	fixPagesHeight()

	//Init Pages
	var pages = $('.swiper-container').swiper({
        mode: 'vertical',
        freeMode: false,
        freeModeFluid: false
    });

    $('#soundControl').click(function(){
        if(bgm.paused){
            bgm.play();
        }else{
            bgm.pause();
        }
    });

})