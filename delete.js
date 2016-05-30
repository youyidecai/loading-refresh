var TouchEvent = (function(){
  return {

    touches:function(obj,oEvent,fnd){
      /*
      参数说明：
          obj   当前的对象；
          oEvent  swipeleft 、 swiperight、swipeup 、swipedown 、singleTap、touchstart、touchmove、touchend
          fnd 回调函数;

      */
      var defaults = {
        x  : 2,   //默认滑动范围 X 不能小于5;
        y  : 2,   //默认滑动范围 Y 不能小于5;
        ox : 0,   //默认的开始 x 轴的值；
        oy : 0,   //默认的开始 y 轴的值；
        nx : 0,   //默认的结束 x 轴的值；
        ny : 0    //默认的结束 y 轴的值；
      };

      oEvent = oEvent.toLowerCase(); // 大小写转换；可以减少报错率；
      var isTouchPad  = (/hp-tablet/gi).test(navigator.appVersion);
      var hasTouch    = 'ontouchstart' in window && !isTouchPad;
      var touchStart  = hasTouch ? 'touchstart' : 'mousedown';
      var touchMove   = hasTouch ? 'touchmove' : '';
      var touchEnd    = hasTouch ? 'touchend' : 'mouseup';
      var scrollY; //用于检测页面是否是滑动或滚动条滚动；

      //var scrollX;
      var a = {

        /*触摸开始方法*/
        tStartFun:function(e){
          //e.preventDefault();
          scrollY= undefined;
          //scrollX= undefined;
          defaults.ox = e.targetTouches[0].pageX; //手势开始时的X轴位置；
          defaults.oy = e.targetTouches[0].pageY; //手势开始时的Y轴位置；
          defaults.nx = defaults.ox;
          defaults.ny = defaults.oy;

          if(oEvent.indexOf("touchstart") != -1){ //如果是绑定的这个事件;

                  fnd();        //执行回调函数；
          };

          /*添加 “移动” 事件监听；*/
          obj.addEventListener(touchMove,a.tMoveFun,false);
          /*添加 “结束” 事件监听；*/
          obj.addEventListener(touchEnd,a.tEndFun,false);

        },
        /*触摸移动方法*/
        tMoveFun:function(e){
          //if( hasTouch ){ if ( e.targetTouches.length > 1 || e.scale && e.scale !== 1) return };
          //e.preventDefault();
          //oStop = true;
           //多点或缩放

          defaults.nx = e.targetTouches[0].pageX; //手势移动时的X轴位置,即最后的值等于手指；
          defaults.ny = e.targetTouches[0].pageY; //手势移动时的Y轴位置；
          var changeY = defaults.oy - defaults.ny; //手指抬起时 Y 轴的最后值 || (开始时的值 - 移动时的值)；
          var changeX = defaults.ox - defaults.nx; //手指抬起时 X 轴的最后值 || (开始时的值 - 移动时的值)；

          if ( typeof scrollY == 'undefined' ) {//|| (typeof scrollX == 'undefined')
                   scrollY = !!( scrollY || Math.abs(changeX ) < Math.abs(changeY) );
                   //scrollX = !!( scrollX || Math.abs(changeY ) < Math.abs(changeX) );
          }
          if( !scrollY ){ //当确定页面不是滚动时，才阻止浏览器默认事件;|| !scrollX

                  e.preventDefault(); //当确定页面不是滚动时，才阻止浏览器默认事件;

                  if(oEvent.indexOf("touchmove") != -1){//如果是绑定的这个事件;

                          fnd(); //执行回调函数；
                  }
          }

        },

        /*触摸结束的方法*/
        tEndFun:function(e){
               
          var changeY   = defaults.oy - defaults.ny; //手指抬起时 Y 轴的最后值 || (开始时的值 - 移动时的值)；
          var changeX = defaults.ox - defaults.nx; //手指抬起时 X 轴的最后值 || (开始时的值 - 移动时的值)；

          //如果 最后的X 轴值 大于 Y轴的值 并且 Y轴的值 大于 y= 5 就开始判断事件
          // 因为默认如果移动的范围小于 5*5 就当做点击事件处理；
          if(Math.abs(changeX) > Math.abs(changeY) && Math.abs(changeY) > defaults.y){

                  //左右事件；
                  if(changeX > 0){ // 如果 X 轴 的值大于 0 说明用于有移动；就进行事件判断，判断用户绑定的是什么事件；；
                          if(oEvent.indexOf("swipeleft") != -1){ // 如果绑定的是 向左滑动事件，即执行向左的回调函数；
                                  fnd();//执行回调函数；
                          }
                  }else{

                          if(oEvent.indexOf("swiperight") != -1){ // 如果绑定的是 向左滑动事件，即执行向左的回调函数；
                                  fnd();//执行回调函数；
                          }
                  }

          }else if(Math.abs(changeY) > Math.abs(changeX) && Math.abs(changeX) > defaults.x){

                  //上下事件；
                  if(changeY > 0){  // 如果 Y 轴 的值大于 0 说明用于有移动；就进行事件判断，判断用户绑定的是什么事件；；
                         
                          if(oEvent.indexOf("swipeup") != -1){// 向上滑动事件，即执行向上的回调函数；
                                  fnd();
                          }
                  }else{

                          if(oEvent.indexOf("swipedown") != -1) { // 向下滑动事件，即执行向下的回调函数；
                                  fnd();
                          }

                  }
          }else{
                  //点击事件；即用户滑动的范围小于默认的5*5
                  if(oEvent.indexOf("singletap") != -1){ //点击事件
                          fnd();
                  }

          }

          //如果绑定的是 结束 事件；
          if(oEvent.indexOf("touchend") != -1){
                  fnd();
          }
         
          /*事件结束时，删除相应的监听事件；*/
          obj.removeEventListener(touchMove,a.tMoveFun,false);
          obj.removeEventListener(touchEnd,a.tEndFun,false);
        }

      }
      //添加 “开始” 事件监听；
      obj.addEventListener(touchStart,a.tStartFun,false);
           
    }

  };//return END;

})();
var tempWrapId = document.getElementById('mMain');
  //向左滑动的事件；
  TouchEvent.touches(tempWrapId,'swipeLeft',function(event){

          if(oStop){
                 
                  oStop = false;
                  i++;
                  if(i>(max-1)){

                          i = max-1;
                          oStop = true;
                          return false;

                  }
                 
                  $('.m-main .m-item').find('.btn-slide').css('opacity',0);
                  $('#bodyWrap .m-main').animate({'top':-(i*itemH)},400);
                  $('.m-main .m-item').eq(i).find('.btn-slide').css('opacity',1);
                  oStop = true;
          }
         
  });
