/**
 * Created by eva on 16/4/18.
 */

//通过requirejs将功能封装成模块，并注册成jquery插件
requirejs.config({
    paths: {
        jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min'
    }
});

requirejs(['jquery','backtop'],function($, backtop){

    $('#backTop').backtop({//调用jquery插件方式
        mode: 'move'
    });

    /*new backtop.BackTop($('#backTop'), {//调用模块方式
        mode: 'go'
    });*/

    /*
    var scroll = new scrollTo.ScrollTo();

    $('#backTop').on('click', $.proxy(scroll.go, scroll));//添加返回顶部函数
    $(window).on('scroll',function(){
        checkPosition($(window).height());
    });//为窗口滚动添加监听事件
    checkPosition($(window).height());

    function move(){
        //$('html,body').animate({scrollTop: 0}, 800)
        $('html,body').scrollTop(0);
    }

    function checkPosition(pos){
        if($(window).scrollTop() > pos){
            $('#backTop').fadeIn();
        }else{
            $('#backTop').fadeOut();
        }
    }*/
});