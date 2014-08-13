var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|micromessenger/i.test(navigator.userAgent.toLowerCase()));

if(!device){
    alert('请用手机浏览器浏览已得到最佳效果');
}

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


    var lottery = new Lottery('lotteryContainer', 'img/mask.jpg', 'image', $(window).width(),$(window).height(),
        function (percent) {
            if(percent>=60){
                $('#paint').fadeOut(300,function(){
                    $(this).remove();
                    bgm.play();
                });
            }
        }
    );
    lottery.init('img/gallery-2.jpg', 'image');

    $('#stage').bind('maskloaded',function(){
        $('#loading').fadeOut(500);
    });

})