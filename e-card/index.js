
window.onload = function(){
    var page1 = document.getElementById("page1");
    var page2 = document.getElementById("page2");
    var page3 = document.getElementById("page3");

    var musicCtrl = document.getElementById("musicCtrl");
    var audio = document.getElementsByTagName("audio")[0];

    //音乐播放结束，光盘旋转效果自动停止
    audio.addEventListener('ended',function(event){//ended是audio的一个API
        musicCtrl.setAttribute('class','');
        //musicCtrl.style.animationPlayState = "paused";
    },false);

    //点击音乐图标控制音乐播放效果
    musicCtrl.addEventListener('touchstart',function(event){
        if(audio.paused){
            audio.play();
            this.setAttribute('class','play');
            //this.style.animationPlayState = "running";//兼容性太差，iPhone手机以及低版本安卓不兼容
        }else{
            audio.pause();
            this.setAttribute('class','');
            //this.style.animationPlayState = "paused";
        }
    },false);

    /*
    musicCtrl.onclick = function(){
        if(audio.paused){
            audio.play();
            this.setAttribute('class','play');
            //this.style.animationPlayState = "running";
        }else{
            audio.pause();
            this.setAttribute('class','');
            //this.style.animationPlayState = "paused";
        }

    }*/

    page1.addEventListener('touchstart',function(event){
        page1.style.display = "none";
        page2.style.display = "block";

        setTimeout(function(){
            page2.setAttribute('class','page fadeOut');
            page3.setAttribute('class','page fadeIn');
            page3.style.display = "block";
        }, 5500)
    },false);

};
