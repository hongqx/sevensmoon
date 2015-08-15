/**
 * 实现小男孩走路
 */
function BoyWalk(){
    var container = $("#content");
    //页面可视区域 
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
	//修正小男孩的初始位置
	var $boy = $("#boy");
	var boyHeight = $boy.height();
	var boyWidth = $boy.width();
	$boy.css({
		top:(pathY - boyHeight +25)+"px"
	});

	//暂停走路
	function pauseWalk(){
		$boy.addClass("pauseWalk");
	}

	//恢复走路
	function startWalk(){
		$boy.removeClass("pauseWalk");
	}
	//css3走路动作变化
	function slowWalk(){
		$boy.addClass("slowWalk");
	}
	//恢复运动
	function startRun(options,runTime){
		var dfdPlay = $.Deferred();
		//先回复走路 
		startWalk();
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

	//计算移动的距离 direction:方向 proportion移动的百分比
	function calculateDist(direction,proportion){
		return (direction==="x" ? visualWidth:visualHeight)*proportion;
	}
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
		}
	}
}