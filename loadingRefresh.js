/**
 * dropload
 * 西门
 * 0.7.0(151225)
 */
!function(a) {
    "use strict";
    function g(a) {
        a.touches || (a.touches = a.originalEvent.touches)
    }
    //返回手指开始位置
    function h(a, b) {
        b._startY = a.touches[0].pageY,
        b.touchScrollTop = b.$scrollArea.scrollTop()
    }
    //手指滑动的过程中判断手指滑动方向，不执行下拉刷新函数
    function i(b, c) {
    	//手指结束点击位置
        c._curY = b.touches[0].pageY, 
        c._moveY = c._curY - c._startY, //手指移动的距离含负值
        c._moveY > 0 ? c.direction = "down" : c._moveY < 0 && (c.direction = "up"); //判断手机移动方向
        var d = Math.abs(c._moveY); //手指移动的距离绝对值

        //下拉刷新
        "" != c.opts.loadUpFn && c.touchScrollTop <= 0 && "down" == c.direction && !c.isLockUp && (b.preventDefault(),
        c.$domUp = a("." + c.opts.domUp.domClass), //下拉刷新的元素类
        c.upInsertDOM || (c.$element.prepend('<div class="' + c.opts.domUp.domClass + '"></div>'), //增加下拉元素HTML
        c.upInsertDOM = !0),
        l(c.$domUp, 0),

        if(d <= c.opts.distance) { 
        	//手机滑动距离小于50，显示下拉刷新
        	c._offsetY = d, 
       		c.$domUp.html(c.opts.domUp.domRefresh)  //显示下拉刷新
        }
        else {
        	//手机滑动距离大于50
        	d > c.opts.distance && 
        	if(d <= 2 * c.opts.distance) { 
        		//手指滑动距离大于50小于100
        		c._offsetY = c.opts.distance + .5 * (d - c.opts.distance); 
	        	c.$domUp.html(c.opts.domUp.domUpdate); //显示释放更新
        	}
        	else {
        		c._offsetY = c.opts.distance + .5 * c.opts.distance + .2 * (d - 2 * c.opts.distance),
	        	c.$domUp.css({
	            	height: c._offsetY //下拉刷新元素的高度
		        })
	    	}
        })
    }
    //手指放开后的刷新操作，执行下拉刷新函数
    function j(b) {  //添加下拉刷新的HTML
        var c = Math.abs(b._moveY);
        "" != b.opts.loadUpFn && b.touchScrollTop <= 0 && "down" == b.direction && !b.isLockUp && (l(b.$domUp, 300),
        if(c > b.opts.distance) {
        	b.$domUp.css({
	            height: b.$domUp.children().height()
	        }),
	        b.$domUp.html(b.opts.domUp.domLoad),//显示加载中
	        b.loading = !0,  //flag 执行刷新加载操作 loading存在
	        b.opts.loadUpFn(b) //执行下拉刷新函数
        }
        else {
        	b.$domUp.css({  //.dropload-up
	            height: "0"
	        }).on("webkitTransitionEnd transitionend", function() {
	            b.upInsertDOM = !1,
	            a(this).remove() 
	        })
        }, b._moveY = 0)
    }
    function k(a) {
        a._scrollContentHeight = a.opts.scrollArea == b ? e.height() : a.$element[0].scrollHeight
    }
    function l(a, b) {
        a.css({
            "-webkit-transition": "all " + b + "ms",
            transition: "all " + b + "ms"
        })
    }
    var f, b = window, c = document, d = a(b), e = a(c);
    //d = $(window), e = $(document)
    a.fn.dropload = function(a) {
        return new f(this,a)
    }
    ,
    f = function(b, c) {
        var d = this;
        d.$element = a(b),  
        d.upInsertDOM = !1,
        d.loading = !1, //loading不存在
        d.isLockUp = !1,
        d.isLockDown = !1,
        d.isData = !0,
        d._scrollTop = 0,
        d.init(c)
    }
    ,
    f.prototype.init = function(f) {
        function l() {
            k.direction = "up",
            k.$domDown.html(k.opts.domDown.domLoad),
            k.loading = !0,  //loading存在，不执行刷新加载操作
            k.opts.loadDownFn(k) //执行上拉加载
        }
        var k = this;
        k.opts = a.extend({}, {
            scrollArea: k.$element,  
            domUp: {
                domClass: "dropload-up",
                domRefresh: '<div class="dropload-refresh">↓下拉刷新</div>',
                domUpdate: '<div class="dropload-update">↑释放更新</div>',
                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
            },
            domDown: {
                domClass: "dropload-down",
                domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData: '<div class="dropload-noData">暂无数据</div>'
            },
            distance: 50,
            threshold: "",
            loadUpFn: "",
            loadDownFn: ""
        }, f),
        //k=this
        //d = $(window), e = $(document), b = window, c = document

        //上拉加载
        "" != k.opts.loadDownFn && (k.$element.append('<div class="' + k.opts.domDown.domClass + '">' + k.opts.domDown.domRefresh + "</div>"),
        k.$domDown = a("." + k.opts.domDown.domClass)),

        if(k.opts.scrollArea == b) {
        	k.$scrollArea = d;
	        k._scrollContentHeight = e.height();
	        k._scrollWindowHeight = c.documentElement.clientHeight;
        }
        else {
        	k.$scrollArea = k.opts.scrollArea;
	        k._scrollContentHeight = k.$element[0].scrollHeight;
	        k._scrollWindowHeight = k.$element.height();
        },
        k._scrollContentHeight <= k._scrollWindowHeight && l(), //loading存在，默认不执行上拉加载

        d.on("resize", function() {
            k._scrollWindowHeight = k.opts.scrollArea == b ? b.innerHeight : k.$element.height()
        }),
        //添加手指监听事件
        k.$element.on("touchstart", function(a) {
        	//k.loading存在时，表示不进行下拉刷新上拉加载操作；k.loading == 0时，执行后面的函数
            k.loading || (g(a),
            h(a, k))
        }),
        k.$element.on("touchmove", function(a) {
            k.loading || (g(a, k),
            i(a, k))
        }),
        k.$element.on("touchend", function() {
            k.loading || j(k)
        }),
        //对滚动元素添加元素滚动事件监听
        k.$scrollArea.on("scroll", function() {
            k._scrollTop = k.$scrollArea.scrollTop(),
            k._threshold = "" === k.opts.threshold ? Math.floor(1 * k.$domDown.height() / 3) : k.opts.threshold,
            "" != k.opts.loadDownFn && !k.loading && !k.isLockDown && k._scrollContentHeight - k._threshold <= k._scrollWindowHeight + k._scrollTop && l()
        })
    }
    ,
    f.prototype.lock = function(a) {
        var b = this;
        void 0 === a ? "up" == b.direction ? b.isLockDown = !0 : "down" == b.direction ? b.isLockUp = !0 : (b.isLockUp = !0,
        b.isLockDown = !0) : "up" == a ? b.isLockUp = !0 : "down" == a && (b.isLockDown = !0)
    }
    ,
    f.prototype.unlock = function() {
        var a = this;
        a.isLockUp = !1,
        a.isLockDown = !1
    }
    ,
    f.prototype.noData = function() {
        var a = this;
        a.isData = !1
    }
    ,
    f.prototype.resetload = function() {
        var b = this;
        "down" == b.direction && b.upInsertDOM ? b.$domUp.css({
            height: "0"
        }).on("webkitTransitionEnd mozTransitionEnd transitionend", function() {
            b.loading = !1,
            b.upInsertDOM = !1,
            a(this).remove(),
            k(b)
        }) : "up" == b.direction && (b.loading = !1,
        b.isData ? (b.$domDown.html(b.opts.domDown.domRefresh),
        k(b)) : b.$domDown.html(b.opts.domDown.domNoData))
    }
}(window.Zepto || window.jQuery);
