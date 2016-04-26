(function($){
    var LightBox = function(){
        var self = this;

        //创建遮罩层和弹出层
        this.popupMask = $('<div id="lightbox-mask">');
        this.popupWin = $('<div id="lightbox-popup">');

        //保存body
        this.bodyNode = $(document.body);

        //渲染余下的DOM，并且插入到body
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

        //关闭弹出
        this.popupMask.click(function(){
            $(this).fadeOut();
            self.popupWin.fadeOut();
            self.clear = false;
        });
        this.closeBtn.click(function(){
            self.popupMask.fadeOut();
            self.popupWin.fadeOut();
            self.clear = false;
        });

        //绑定上下切换按钮事件
        this.flag = true;//处理多次点击引起的bug
        this.nextBtn.hover(function(){
            if(!$(this).hasClass("disabled")&&self.groupData.length>1){
                $(this).addClass("lightbox-next-btn-show");
            }
        },function(){
            if(!$(this).hasClass("disabled")&&self.groupData.length>1){
                $(this).removeClass("lightbox-next-btn-show");
            }
        }).click(function(e){
            if(!$(this).hasClass("disabled")&&self.flag){
                self.flag = false;
                e.stopPropagation();

                self.goto("next");
            }
        });

        this.prevBtn.hover(function(){
            if(!$(this).hasClass("disabled")&&self.groupData.length>1){
                $(this).addClass("lightbox-prev-btn-show");
            }
        },function(){
            if(!$(this).hasClass("disabled")&&self.groupData.length>1){
                $(this).removeClass("lightbox-prev-btn-show");
            }
        }).click(function(e){
            if(!$(this).hasClass("disabled")&&self.flag){
                self.flag = false;
                e.stopPropagation();

                self.goto("prev");
            }
        });

        //绑定窗口调整事件
        var timer;
        this.clear = false;
        $(window).resize(function(){

            if(self.clear){
                window.clearTimeout(timer);
                timer = window.setTimeout(function(){
                    self.loadPic(self.groupData[self.index].src);
                },500);
            }
        })
    };

    //在LightBox的原型里封装所需的方法
    LightBox.prototype = {
        goto: function(dir){
            if(dir === "next"){
                this.index++;
                if(this.index >= this.groupData.length-1){
                    this.nextBtn.addClass("disabled").removeClass("lightbox-next-btn-show");
                }
                if(this.index != 0){
                    this.prevBtn.removeClass("disabled");
                }

                var src = this.groupData[this.index].src;
                this.loadPic(src);

            }else if(dir === "prev"){
                this.index--;
                if(this.index <= 0){
                    this.prevBtn.addClass("disabled").removeClass("lightbox-prev-btn-show");
                }
                if(this.index != this.groupData.length-1){
                    this.nextBtn.removeClass("disabled");
                }

                var src = this.groupData[this.index].src;
                this.loadPic(src);
            }
        },
        loadPic: function(sourceSrc){
            var self = this;
            self.popupPic.css({
                width: "auto",
                height: "auto"
            }).hide();
            self.picCaption.hide();

            //调用预加载图片方法preLoadImg
            this.preLoadImg(sourceSrc,function(){
                self.popupPic.attr("src",sourceSrc);

                //获取图片实际的宽高
                var picWidth = self.popupPic.width(),
                    picHeight = self.popupPic.height();

                //根据图片宽高和视口比例设置弹出层尺寸以及过渡动画
                self.changePic(picWidth,picHeight);
            })
        },
        changePic: function(width,height){
            var self = this;
            var winWidth = $(window).width(),
                winHeight = $(window).height();

            //如果图片宽高大于浏览器视口宽高比例，判断图片是否溢出
            var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);

            width = width * scale;
            height = height * scale;

            this.picView.animate({
                width: width-10,
                height: height-10
            });

            this.popupWin.animate({
                width: width,
                height: height,
                marginLeft: -(width/2),
                top: (winHeight-height)/2
            },function(){
                self.popupPic.css({
                    width: width-10,
                    height: height-10
                }).fadeIn();

                self.picCaption.fadeIn();
                self.flag = true;
                self.clear = true;
            });

            //设置图片标题和当前索引
            this.captionText.text(this.groupData[this.index].caption);
            this.currentIndex.text("当前索引："+(this.index+1)+"/"+this.groupData.length);
        },
        preLoadImg: function(src,callback){
            var img = new Image();

            //判断是否是IE浏览器
            if(!!window.ActiveXObject){
                img.onreadystatechange = function(){
                    //判断图片是否加载完成
                    if(this.readyState == "complete"){
                        callback();
                    }
                }
            }else{
                img.onload = function(){
                    callback();
                }
            }

            img.src = src;
        },
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
                if(this.index === 0){
                    this.prevBtn.addClass("disabled");
                    this.nextBtn.removeClass("disabled");
                }else if(this.index === len-1){
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

            $(this.groupData).each(function(i){
                index = i;
                if(this.id === currentId){
                    return false;
                }
            });

            return index;
        },
        initPopup: function(currentObj){
            var sourceSrc = currentObj.attr("data-source"),
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

        },
        renderDOM: function(){
            var strDOM = '<div class="lightbox-pic-view">'+
                '<span class="lightbox-btn lightbox-prev-btn"></span>'+
                '<img class="lightbox-image" src="">'+
                '<span class="lightbox-btn lightbox-next-btn"></span>'+
                '</div>'+
                '<div class="lightbox-pic-caption">'+
                '<div class="lightbox-pic-area">'+
                '<p class="lightbox-pic-desc"></p>'+
                '<span class="lightbox-index"></span>'+
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
