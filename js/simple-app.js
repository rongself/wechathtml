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
    var  imageLazyLoader = function(){
        var self = this;
        self.load = function(ele){
            var url = $(ele).attr('data-img-src');
            if(url){
                if($(ele).css('background-image')=='none'){
                    var loadingHtml = '<div id="loading" style="background-color: transparent;">\
                                <div class="spinner">\
                                <div class="dot1"></div>\
                                <div class="dot2"></div>\
                                </div>\
                                </div>';
                    if(!$(ele).has('#loading').length > 0){
                        var loading = $(loadingHtml).appendTo(ele);
                    }
                    $('<img/>').bind('load',function(){
                        $(ele).css('background-image','url("../'+url+'")');
                        loading.remove();
                    }).attr('src',url);

                }
            }else{
                throw 'this div has not "data-img-src" attr';
            }
        }
    }
    var loader = new imageLazyLoader();
    loader.load($('.swiper-wrapper .bg-img').eq(0));
    loader.load($('.swiper-wrapper .bg-img').eq(1));
	var pages = $('.swiper-container').swiper({
        mode: 'vertical',
        freeMode: false,
        freeModeFluid: false,
        onSlideChangeStart:function(item){
            var count = item.slides.length;
            var index = item.activeIndex;
            //console.log(item);
            if(index+1<count){
                loader.load($(item.slides[index+1]).children('div'));
            }

            if(index == $('.bg-img').length-1){
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