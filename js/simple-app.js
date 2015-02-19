//var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|micromessenger/i.test(navigator.userAgent.toLowerCase()));
//
//if(!device){
//    alert('请用手机浏览器浏览已得到最佳效果');
//}
$(function(){
    var images = document.getElementsByClassName('bg-img');
	//Init Pages
    var  imageLazyLoader = function(){
        var self = this;
        self.loadCount = 0;
        self.load = function(eles){
            for(var i =0 ;i<eles.length;i++){
                var url = $(eles[i]).attr('data-img-src');
                if(url){
                    if($(eles[i]).css('background-image')=='none'){
                        $(document).trigger('imgBeforeLoading',[eles[i]]);

                        //load image and set as background
                        $('<img/>').on('load',eles[i],function(e){
                            self.loadCount ++;
                            $(document).trigger('imgLoading',[self.loadCount, e.data]);
                            $(e.data).trigger('imgLoad');
                        }).attr('src',url);

                    }
                }else{
                    throw 'this div has not "data-img-src" attr';
                }
            }
        }

        self.preLoad = function(eles,preLoadCount){
            preLoadCount = preLoadCount||2;
            for(var i =0 ;i<eles.length;i++){
                self.load(eles[i]);
            }
        }
    }

    $(document).on('imgBeforeLoading',function(e,element){
        //handle load animate
        var loadingHtml = '<div id="loading" style="background-color: transparent;">\
                                <div class="spinner">\
                                <div class="dot1"></div>\
                                <div class="dot2"></div>\
                                </div>\
                            </div>';
        if(!$(element).has('#loading').length > 0){
            var loading = $(loadingHtml).appendTo(element);
        }
    });

    $(document).on('imgLoading',function(e,count,element){
        var url = $(element).attr('data-img-src');

        $(element).css('background-image','url("'+url+'")').hide().fadeIn(300);
        var loading = $(element).children('#loading');
        if(loading&&loading.length > 0){
            loading.remove();
        }
        $('#loadingCount').text(parseInt((count/images.length)*100)+'%');
        if(count>=images.length){
            bgm.play();
            $('#loading').fadeOut(500);
            var image = images[0];
            var texts = $(image).children('div');
            texts.each(function(){
                var className =  $(this).attr('data-class');
                if(className){
                    $(this).addClass(className);
                }
            });
        }
    });

    var loader = new imageLazyLoader();
    loader.load(images);
    var pages = $('.swiper-container').swiper({
        mode: 'vertical',
        freeMode: false,
        freeModeFluid: false,
        onSlideChangeStart:function(item){
            var count = item.slides.length;
            var index = item.activeIndex;
            if(index!=0){
                var image = images[index];
                var texts = $(image).children('div');
                texts.each(function(){
                    var className =  $(this).attr('data-class');
                    console.log(className);
                    if(className){
                        $(this).addClass(className);
                    }
                });
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
