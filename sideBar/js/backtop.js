/**
 * Created by eva on 16/4/19.
 */
define(['jquery','scrollTo'],function($,scrollTo){
    function BackTop(el, opts){
        this.opts = $.extend({}, BackTop.Defaults, opts);
        this.$el = $(el);
        this.scroll = new scrollTo.ScrollTo({
            dest: 0,
            speed: this.opts.speed
        });

        this._checkPosition();
        if(this.opts.mode == 'move'){
            this.$el.on('click', $.proxy(this._move, this));
        }else{
            this.$el.on('click', $.proxy(this._go, this));
        }

        $(window).on('scroll', $.proxy(this._checkPosition, this));
    }

    BackTop.Defaults = {
        mode: 'move',
        pos: $(window).height(),
        speed: 800
    };

    BackTop.prototype._move = function(){
        this.scroll.move();
    };
    BackTop.prototype._go = function(){
        this.scroll.go();
    };
    BackTop.prototype._checkPosition = function(){
        if($(window).scrollTop() > this.opts.pos){
            this.$el.fadeIn();
        }else{
            this.$el.fadeOut();
        }
    };

    //注册成jquery插件形式
    $.fn.extend({
        backtop: function(opts){
            return this.each(function(){
                new BackTop(this, opts);
            });
        }
    });

    return {
        BackTop: BackTop
    }
});