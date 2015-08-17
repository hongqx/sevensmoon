/*实现页面的滑动*/
function Swipe(container){
	//获取第一个子元素
	var element = container.find(":first");
	//滑动的对象
	var swipe ={};
	var slides = element.find(".page");
	var width = container.width();
	var height = container.height();
	 element.css({
        width:(slides.length * width)+"px",
        height:height+"px"
       });
	//设置每一个li的高宽
    $.each(slides, function(index) {
        var slide = slides.eq(index); //获取到每一个li元素    
        slide.css({
            width: width + 'px',
            height: height + 'px'
        });
    });
    swipe.scrollTo = function(x,speed){
       //执行动画移动
       element.css({
       	"transition-timing-function":"linear",
       	"transition-duration":speed+"ms",
       	"transform":'translate3d(-'+x+'px,0px,0px)'
       });
       return this;
    };
    return swipe;
}