/**
 * Created by eva on 16/4/19.
 */

//通过requirejs将功能封装成模块，并注册成jquery插件

define(['jquery'],function($){
    function ScrollTo(opts){
        this.opts = $.extend({}, ScrollTo.Defaults, opts);
        this.$el = $('html,body');
    }

    ScrollTo.prototype.move = function(){
        if($(window).scrollTop() != this.opts.dest){    //判断滚动条是否到达指定位置
            if(!this.$el.is(':animated')){     //判断滚动条是否在运动
                this.$el.animate({scrollTop: this.opts.dest}, this.opts.speed);
            }
        }

    };
    ScrollTo.prototype.go = function(){
        this.$el.scrollTop(this.opts.dest);
    };

    //定义默认参数
    ScrollTo.Defaults = {
        dest: 0,
        speed: 800
    };

    return {
        ScrollTo: ScrollTo
    };
});