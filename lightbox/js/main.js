(function($){
    var LightBox = function(){
        var self = this;

        //创建遮罩层和弹出层
        this.popupMask = $('<div id="lightbox-mask">');
        this.popupWin = $('<div id="lightbox-popup">');

        //保存body
        this.bodyNode = $(document.body);

        //渲染余下的DO，并且插入到body
        this.renderDOM();
        this.picView = this.popupWin.find("div.lightbox-pic-view");   //获取图片的预览区域
        this.popupPic = this.popupWin.find("img.lightbox-image");  //获取图片
        this.nextBtn = this.popupWin.find("span.lightbox-next-btn");
        this.prevBtn = this.popupWin.find("span.lightbox-prev-btn"); //获取翻页按钮

        this.picCaption = this.popupWin.find("div.lightbox-pic-caption"); //获取图片标题区域
        this.captionText = this.popupWin.find("p.lightbox-pic-desc");//获取当前图片标题
        this.currentIndex = this.popupWin.find("span.lightbox-index");//获取当前图片索引
        this.closeBtn = this.popupWin.find("span.lightbox-close-btn");//获取关闭按钮


        //准备开发事件委托，获取组数据
        // delegate() 方法为指定的元素（属于被选元素的子元素）添加一个或多个事件处理程序，并规定当这些事件发生时运行的函数
        this.groupName = null;
        this.groupData = [];//放置同一组数据
        this.bodyNode.delegate(".js-lightBox,*[data-role=lightBox]","click",function(e){
            //阻止事件冒泡
            e.stopPropagation();

            //获取当前图片所在的组名,attr() 方法设置或返回被选元素的属性值
            var currentGroupName = $(this).attr("data-group");

            if(currentGroupName != self.groupName){
                self.groupName = currentGroupName;

                //根据当前组名获取同一组数据
                self.getGroup();
            }

            //初始化弹窗
            self.initPopup($(this));
        });

    };

    //在LightBox的原型里封装所需的方法
    LightBox.prototype = {
        loadPic: function(sourceSrc){},
        showMaskPopup: function(sourceSrc,currentId){
            var self = this;

            //开始时隐藏图片以及标题区域，后续设置效果
            this.popupPic.hide();
            this.picCaption.hide();

            //遮罩层淡入出现
            this.popupMask.fadeIn();

            //保存当前视口的宽高
            var winWidth = $(window).width(),
                winHeight = $(window).height();

            //设置图片预览区域的宽高,弹出框淡入出现
            this.picView.css({
                width: winWidth/2,
                height: winHeight/2
            });
            this.popupWin.fadeIn();
            //调整弹出框宽高位置，使其居中
            this.popupWin.css({
                width: winWidth/2+10,
                height: winHeight/2+10,
                marginLeft: -(winWidth/2+10)/2,
                top: -(winHeight/2+10)
            }).animate({
                top: (winHeight/2+10)/2
            },function(){
                //加载图片
                self.loadPic(sourceSrc);
            });

            //根据当前点击的图片ID获取其在该组里的索引
            this.index = this.getIndexOf(currentId);

            //根据索引判断上下切换按钮是否出现，若一组只有一张图片则按钮都不出现，
            // 若一组有多张图片，点击第一张不显示向上按钮，点击最后一张不显示向下按钮
            var len = this.groupData.length;
            if(len>1){
                if(this.index === 1){
                    this.prevBtn.addClass("disabled");
                    this.nextBtn.removeClass("disabled");
                }else if(this.index === len){
                    this.prevBtn.removeClass("disabled");
                    this.nextBtn.addClass("disabled");
                }else{
                    this.prevBtn.removeClass("disabled");
                    this.nextBtn.removeClass("disabled");
                }
            }
        },
        getIndexOf: function(currentId){
            var index = 0;

            $(this.groupData).each(function(){
                index++;
                if(this.id === currentId){
                    return false;
                }
            });

            return index;
        },
        initPopup: function(currentObj){
            var self = this,
                sourceSrc = currentObj.attr("data-source"),
                currentId = currentObj.attr("data-id");

            //sourceSrc和currentId传递到方法showMaskPopup中显示遮罩层和弹出层
            this.showMaskPopup(sourceSrc,currentId);
        },
        getGroup: function(){
            var self = this;
            //根据当前组别名称获取页面中同一组别的所有对象
            var groupList = this.bodyNode.find("*[data-group="+this.groupName+"]");

            //清空数据
            self.groupData.length = 0;

            groupList.each(function(){
                self.groupData.push({
                    src: $(this).attr("data-source"),
                    id: $(this).attr("data-id"),
                    caption: $(this).attr("data-caption")
                })

            });
            //console.log(self.groupData);

        },
        renderDOM: function(){
            var strDOM = '<div class="lightbox-pic-view">'+
                '<span class="lightbox-btn lightbox-prev-btn"></span>'+
                '<img class="lightbox-image" src="images/1-1.jpg" width="100%">'+
                '<span class="lightbox-btn lightbox-next-btn"></span>'+
                '</div>'+
                '<div class="lightbox-pic-caption">'+
                '<div class="lightbox-pic-area">'+
                '<p class="lightbox-pic-desc"></p>'+
                '<span class="lightbox-index">图片索引：0/0</span>'+
            '</div>'+
            '<span class="lightbox-close-btn"></span>'+
                '</div>';

            //将拼接好的strDOM插入到this.popupWin
            this.popupWin.html(strDOM);

            //将遮罩层和弹出层插入到body
            this.bodyNode.append(this.popupMask, this.popupWin)
        }
    };

    //将LightBox注册到全局对象上
    window['LightBox'] = LightBox;
})(jQuery);
