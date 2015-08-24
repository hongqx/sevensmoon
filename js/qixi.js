//动画结束事件
var animationEnd = (function(){
   var exporer = navigator.userAgent;
   if(~exporer.indexOf("Webkit")){
     return 'webkitAnimationgEnd';
   }
   return "animationend";
})();

/*灯的动画*/
var lamp = {
  elem:$(".b_background"),
  bright:function(){
    this.elem.addClass("lamp-bright");
  },
  dark:function(){
     this.elem.removeClass("lamp-bright");
  }
};
var container = $("#content");
var swipe = Swipe(container);
var visualHeight = container.height();
var visualWidth = container.width();

/**
 * 页面滚动函数
 * @param  {[type]} time        [滚动耗时]
 * @param  {[type]} proportionX [滚动距离比例,指的是显示容器宽度的倍数]
 * @return {[type]}             [无]
 */
function scrollTo(time,proportionX){
  var distX = visualWidth * proportionX;
  swipe.scrollTo(distX,time);
}

/*
 *根据需求获取某个节点的top he height
 */
var getValue = function(className){
   var $elem = $(className);
   return {
     height:$elem.height(),
     top:$elem.position().top
   };
};

/*初始化桥的Y轴top值*/
var bridgeY = function(){
  var data = getValue(".c_background_middle");
  return data.top;
}();

/***
 *初始化小女孩对象
 ***/
 var girl = {
   elem:$(".girl"),
   getHeight:function(){
      return this.elem.height();
   },
   getWidth:function(){
      return this.elem.width(); 
   },
   setOffset:function(){
      this.elem.css({
        left:visualWidth/2,
        top:bridgeY - this.getHeight()
      });
    },
    rotate:function(){
       this.elem.addClass("girl-rotate");
    },
    getOffset:function(){
       return this.elem.offset();
    }
 };


//初始化小鸟
var bird ={
  elem:$(".bird"),
  fly:function(){
    this.elem.addClass("birdFly");
    this.elem.transition({
      right:container.width()
    },15000,'linear');
  }
};
 /**
  *修正小女孩的位置
  */
 girl.setOffset();

/**
 * 门的开关动作
 * @param  {[string]} left        [左边移动比例]
 * @param  {[string]} right       [右边移动比例]
 * @param   {[num]}   time        [动画耗时]
 * @return {[Deferred]}             [无]
 */
function doorAction(left,right,time){
    var $door = $(".door");
    var doorLeft = $(".door-left");
    var doorRight  = $(".door-right");
    var count = 2;
    var defer = $.Deferred();
    var complete = function(){
      if(count === 1){
         defer.resolve();
         return;
      }
      count--;
    };
    //左边的门left从0% 到-50%
    doorLeft.transition({
      'left':left
    },time,complete);

    //右边的门从left从50%到100%
    doorRight.transition({
      "left":right
    },time,complete);

    return defer;
}
//开门
function openDoor () {
  return doorAction("-50%","100%",2000);
}
//关门
function shutDoor () {
  return doorAction("0%","50%",2000);
}


// 用来临时调整页面
//swipe.scrollTo(visualWidth * 2, 0);

/**
 * 封装小男孩的动作和属性
 */
function BoyWalk(){
    var container = $("#content");
    //页面可视区域 宽高
    var visualWidth = container.width();
    var visualHeight = container.height();
    // 获取数据
    var getValue = function(className) {
        var $elem = $('' + className + '');
            // 走路的路线坐标
        return {
            height: $elem.height(),
            top: $elem.position().top
        };
    };
    //获取路的Y坐标
  	var pathY = function(){
  	   var data = getValue(".a_background_middle");
  	   return data.top + data.height/2;
  	}();
  	
  	var $boy = $("#boy");
  	var boyHeight = $boy.height();
  	var boyWidth = $boy.width();

    //修正小男孩的初始位置
  	$boy.css({
  		top:(pathY - boyHeight +25)+"px"
  	});

  	//暂停走路
  	function pauseWalk(){
  		$boy.addClass("pauseWalk");
  	}

  	//恢复走路
  	function restoreWalk(){
  		$boy.removeClass("pauseWalk");
  	}
  	//css3走路动作变化
  	function slowWalk(){
  		$boy.addClass("slowWalk");
  	}
  	//运动
  	function startRun(options,runTime){
  		var dfdPlay = $.Deferred();
  		//先回复走路 
  		restoreWalk();
  	    //增加向前移动的规则
  		//$boy.css(options);
  		//增加向前移动的规则
  	    /*$boy.css({
  	    		"transition":"left 10000ms linear",
  	    		"left":$("#content").width()+"px"
  	    });*/
           // 运动的属性
      $boy.transition(
          options,
          runTime,
          'linear',
          function() {
              dfdPlay.resolve(); // 动画完成
          });
  		return dfdPlay;
  	}

  	//开始走路
  	function walkRun(time,dist,disY){
  		time = time || 3000;
  		//加上脚的动作
  		slowWalk();
  		//开始向前移动
  		var d1 = startRun({
  			"left":dist+"px",
  			"top":disY ? disY : undefined
  		},time);
  		return d1;
  	}
  	//走进商店
    function walkToShop(runTime){
       var defer = $.Deferred();
       var doorObj= $(".door");

       //获取门的坐标
       var doorOffset = doorObj.offset();
       var doorOffsetLeft = doorOffset.left;
       var doorOffsetTop = doorOffset.top;

       //获取小孩当前的坐标
       var boyOffset = $boy.offset();
       var boyOffsetLeft = boyOffset.left;
       var boyOffsetTop = boyOffset.top;
       var boyHeight = $boy.height();

       //获取水平方向中间位置
       var boyMiddle = $boy.width() / 2;
       var doorMiddle = doorObj.width() / 2;
       var doorTopMiddle = doorObj.height() /2;
 
       //计算当前需要移动的坐标
       instanceX =  (doorOffsetLeft + doorMiddle)-(boyOffsetLeft + boyMiddle);
       //计算Y轴坐标
       //top = 人物底部的top - 门中间的top
       instanceY = boyOffsetTop + boyHeight - doorOffsetTop + doorTopMiddle;

       /*开始走路*/
      /* var walkPlay = startRun({
           transform:"translateX("+instanceX+"px),translateY("+instanceY+"px),scale(.3,.3)",
           opacity:0.1
       },runTime);*/
        var walkPlay = startRun({
           transform:"translateX("+instanceX+"px),scale(.3,.3)",
           opacity:0.1
        },runTime);
        // 走路完毕
         walkPlay.done(function() {
             $boy.css({
                 opacity: 0
             });
             defer.resolve();
         });
        return defer;
    }

    /*走出商店*/
    function walkOutShop(runTime) {
        var defer = $.Deferred();

        var walkPlay = startRun({
        	transform:"translateX("+instanceX+"px),translateY(0),scale(1,1)",
        	opacity:1
        },runTime);
        
        //走路完毕
        walkPlay.done(function(){
        	defer.resolve();
        });
        return defer;
    }

    //计算移动的距离 direction:方向 proportion移动的百分比
    function calculateDist(direction,proportion){
      return (direction==="x" ? visualWidth:visualHeight)*proportion;
    }

    //取花 其实是将人物图片换一下，加一个类名
    function getFlower(){
    	var defer = $.Deferred();
    	setTimeout(function(){
    	//取花
    	  $boy.addClass("slowFlolerWalk");
    	},500);
    }
    
    //返回接口
	  return{
    		//开始走路
    		walkTo:function(time,proportionX,proportionY){
                var distX = calculateDist('x',proportionX);
                var distY = calculateDist("y",proportionY);
                return walkRun(time,distX,distY);
    		} ,
    		//停止走路
    		stopWalk :function(){
    			pauseWalk();
    		},
    		//改变背景色
    		setColor:function(value){
    			$boy.css('background-color',value);
    		},
        //进商店
    	  toShop:function(){
    	    	return walkToShop.apply(null,arguments);
    	  },
        //出商店
        outShop:function(){
        	return walkOutShop.apply(null,arguments);
        },
        getFlower:function(){
        	return getFlower();
        },
        getWidth:function(){
        	return $boy.width();
        },
        //取花
        setFlowerWalk:function(){
            $boy.addClass("slowFlolerWalk");
        },
        //复位初始暂停状态
        resetOriginal: function() {
            this.stopWalk();
            // 恢复图片
            $boy.removeClass('slowFlolerWalk slowWalk').addClass('boyOriginal');
        },
        // 转身动作
        rotate: function(callback) {
          restoreWalk();
          $boy.addClass('boy-rotate');
          // 监听转身完毕
          if (callback) {
             $boy.on(animationEnd, function() {
                 callback();
                 $(this).off();
             });
          }
        }
	};
}
/*******背景音乐********/
var audioConfig = {
    enable:true,
    playURI:"music/happy.wav",
    cycleURI:"music/circulation.wav"
};
function Html5Audio(url,isloop){
    var audio = new Audio(url);
    audio.autoPlay = true;
    audio.loop = isloop;
    audio.play();
    return {
      end:function(callback){
        audio.addEventListener('ended',function(){
          callback();
        },false);
      }
    };
}
if (audioConfig.enable) {
    var audio1 = Html5Audio(audioConfig.playURI);
    audio1.end(function() {
      Html5Audio(audioConfig.cycleURI, true);
    });
}
//飘花
var snowflakeURl = [
 'images/snowflake/snowflake1.png',
 'images/snowflake/snowflake2.png',
 'images/snowflake/snowflake3.png',
 'images/snowflake/snowflake4.png',
 'images/snowflake/snowflake5.png',
 'images/snowflake/snowflake6.png'
];
//飘花容器
var $flakeContainer = $("#snowflake");
function snowflake () {

    //从六张图中随机获取一张
    function getImage(){
      return snowflakeURl[Math.floor(Math.random() * 6)];
    }

    //创建一个花瓣儿元素
    function createSnowBox(){
       var url = getImage();
       return $('<div class="snowbox"></div>').css({
        "width":41,
        "height":41,
         "position":"absolute",
         "backgroundSize":"cover",
         "zIndex":100000,
         "top":"-41px",
         "backgroundImage":'url(' + url + ')'
       }).addClass("snowRoll");

    }

    //开始飘花
    setInterval(function(){
      //运动的轨迹
      var startPositionLeft = Math.random() * visualWidth -100,
          startOpacity = 1,
          endPositionTop = visualHeight - 40,
          endPositionLeft = startPositionLeft - 100 +Math.random() * 500,
          duration = visualHeight * 10 + Math.random() * 5000;

          //随机生成透明度 不小于0.5
          var randomStart = Math.random();
          randomStart = randomStart < 0.5 ? startOpacity : randomStart;

          //创建一个花瓣儿元素
          var $flake =  createSnowBox();

          //设计起点位置
          $flake.css({
            left:startPositionLeft,
            opacity:randomStart
          });

          //加入到容器中
          $flakeContainer.append($flake);
          $flake.transition({
             top:endPositionTop,
             left:endPositionLeft,
             opacity:0.7
          },duration,"ease-out",function(){
            $(this).remove();//动画结束之后移除该节点
          });

    },500);
}