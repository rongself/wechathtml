/**
 * Created by http://www.cnblogs.com/jscode/p/3580878.html
 */
function Lottery(id, cover, coverType, width, height, drawPercentCallback) {
    this.conId = id;
    this.conNode = document.getElementById(this.conId);
    this.cover = cover;
    this.coverType = coverType;
    this.background = null;
    this.backCtx = null;
    this.mask = null;
    this.maskCtx = null;
    this.lottery = null;
    this.lotteryType = 'image';
    this.width = width || 300;
    this.height = height || 100;
    this.clientRect = null;
    this.drawPercentCallback = drawPercentCallback;
}

Lottery.prototype = {
    createElement: function (tagName, attributes) {
        var ele = document.createElement(tagName);
        for (var key in attributes) {
            ele.setAttribute(key, attributes[key]);
        }
        return ele;
    },
    getTransparentPercent: function(ctx, width, height) {
        var imgData = ctx.getImageData(0, 0, width, height),
            pixles = imgData.data,
            transPixs = [];
        for (var i = 0, j = pixles.length; i < j; i += 4) {
            var a = pixles[i + 3];
            if (a < 128) {
                transPixs.push(i);
            }
        }
        return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
    },
    resizeCanvas: function (canvas, width, height) {
        canvas.width = width||$(window).width();
        canvas.height = height||$(window).height();
        canvas.getContext('2d').clearRect(0, 0, width, height);
    },
    startLine:function(x,y){
        this.maskCtx.lineWidth = 60 ;
        this.maskCtx.lineCap = 'round';
        this.maskCtx.moveTo(x,y);

    },
    endLine:function(x,y){
        this.maskCtx.lineTo(x, y);
        this.maskCtx.stroke();
    },
    drawPoint: function (x, y) {
        this.maskCtx.beginPath();
        this.maskCtx.arc(x, y, 20, 0, Math.PI * 2, true);
        this.maskCtx.fill();
    },
    bindEvent: function () {
        var _this = this;
        var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|micromessenger/i.test(navigator.userAgent.toLowerCase()));
        var clickEvtName = device ? 'touchstart' : 'mousedown';
        var moveEvtName = device? 'touchmove': 'mousemove';
        var mouseUpEvtName = device? 'touchend': 'mouseup';
        if (!device) {
            var isMouseDown = false;
            document.addEventListener('mouseup', function(e) {
                isMouseDown = false;
            }, false);
        } else {
            document.addEventListener("touchmove", function(e) {
                if (isMouseDown) {
                    e.preventDefault();
                }
            }, false);
            document.addEventListener('touchend', function(e) {
                isMouseDown = false;
            }, false);
        }
        this.mask.addEventListener(clickEvtName, function (e) {
            isMouseDown = true;
            var docEle = document.documentElement;
            if (!_this.clientRect) {
                _this.clientRect = {
                    left: 0,
                    top:0
                };
            }
            var x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft;
            var y = (device ? e.touches[0].clientY : e.clientY) - _this.clientRect.top + docEle.scrollTop - docEle.clientTop;
            _this.startLine(x,y);
        }, false);
        this.mask.addEventListener(mouseUpEvtName, function (e) {
            isMouseDown = false;
            if (_this.drawPercentCallback) {
                _this.drawPercentCallback.call(null, _this.getTransparentPercent(_this.maskCtx, _this.width, _this.height));
            }
        }, false);
        var frame = 0;
        this.mask.addEventListener(moveEvtName, function (e) {
            frame++;
            if(frame>2){
                if (!device && !isMouseDown) {
                    return false;
                }
                var docEle = document.documentElement;
                if (!_this.clientRect) {
                    _this.clientRect = {
                        left: 0,
                        top:0
                    };
                }
                var x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft;
                var y = (device ? e.touches[0].clientY : e.clientY) - _this.clientRect.top + docEle.scrollTop - docEle.clientTop;
                _this.endLine(x, y);
                frame = 0;
            }
        }, false);
    },
    drawLottery: function () {
        this.mask = this.mask || document.getElementById('stage');

        if (!this.conNode.innerHTML.replace(/[\w\W]| /g, '')) {
            this.conNode.appendChild(this.mask);
            this.clientRect = this.conNode ? this.conNode.getBoundingClientRect() : null;
            this.bindEvent();
        }

        this.maskCtx = this.maskCtx || this.mask.getContext('2d');

        if (this.lotteryType == 'image') {
            var image = new Image(),
                _this = this;
            image.onload = function () {
                _this.width = this.width;
                _this.height = this.height;
                _this.drawMask();
            }
            image.src = this.lottery;
        } else if (this.lotteryType == 'text') {
            this.width = this.width;
            this.height = this.height;
            this.backCtx.save();
            this.backCtx.fillStyle = '#FFF';
            this.backCtx.fillRect(0, 0, this.width, this.height);
            this.backCtx.restore();
            this.backCtx.save();
            var fontSize = 30;
            this.backCtx.font = 'Bold ' + fontSize + 'px Arial';
            this.backCtx.textAlign = 'center';
            this.backCtx.fillStyle = '#F60';
            this.backCtx.fillText(this.lottery, this.width / 2, this.height / 2 + fontSize / 2);
            this.backCtx.restore();
            this.drawMask();
        }
    },
    drawMask: function() {
        this.resizeCanvas(this.mask);
        if (this.coverType == 'color') {
            this.maskCtx.fillStyle = this.cover;
            this.maskCtx.fillRect(0, 0, this.width, this.height);
            this.maskCtx.globalCompositeOperation = 'destination-out';
        } else if (this.coverType == 'image'){
            var image = new Image(),
                _this = this;
            image.onload = function () {
                _this.maskCtx.drawImage(this, 0,0,$(window).width(),$(window).height());
                _this.maskCtx.globalCompositeOperation = 'destination-out';
                $(_this.mask).trigger('maskloaded');
            }
            image.src = this.cover;
        }
    },
    init: function (lottery, lotteryType) {
        this.lottery = lottery;
        this.lotteryType = lotteryType || 'image';
        this.drawLottery();
    }
}

function getRandomStr(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

window.onload = function () {
    var lottery = new Lottery('lotteryContainer', 'img/mask.jpg', 'image', $(window).width(),$(window).height(),function (percent) {
        //console.log(percent);
        if(percent>=60){
            $('#paint').fadeOut(300,function(){
                $(this).remove();
                bgm.play();
            });
        }
    });
    lottery.init('img/gallery-2.jpg', 'image');
    $('#stage').bind('maskloaded',function(){
        $('#loading').fadeOut(500);
    });
}
