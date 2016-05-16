$(function(){
  //  点击导航栏某一个li改变其样式
  $(".nav li").click(function(){
      $(this).addClass("active");
      $(this).siblings().removeClass("active");
  });


    //下拉框国家
    $('.country p').on('click',function(e){
        e.stopPropagation();
        $('.country').toggleClass('open');
    });

    $('.country ul li').on('click',function(e){
        e.stopPropagation();
        var _this = $(this);
        $('.country p').text(_this.attr('data-value'));
        _this.addClass('selected').siblings().removeClass('selected');
        $('.country').removeClass('open');
    });

    $(document).on('click',function(){
        $('.country').removeClass('open');
    });

    //省份
    $('.province p').on('click',function(e){
        e.stopPropagation();
        $('.province').toggleClass('open');
    });

    $('.province ul li').on('click',function(e){
        e.stopPropagation();
        var _this = $(this);
        $('.province p').text(_this.attr('data-value'));
        _this.addClass('selected').siblings().removeClass('selected');
        $('.province').removeClass('open');
    });

    $(document).on('click',function(){
        $('.province').removeClass('open');
    });

    //城市
    $('.city p').on('click',function(e){
        e.stopPropagation();
        $('.city').toggleClass('open');
    });

    $('.city ul li').on('click',function(e){
        e.stopPropagation();
        var _this = $(this);
        $('.city p').text(_this.attr('data-value'));
        _this.addClass('selected').siblings().removeClass('selected');
        $('.city').removeClass('open');
    });

    $(document).on('click',function(){
        $('.city').removeClass('open');
    });
});
