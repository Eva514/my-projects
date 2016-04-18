/**
 * Created by eva on 16/4/15.
 */
//数据定义，实际生产环境中由后台给出
var data = [
    {img:1,h2:'Creative',h3:'DUET'},
    {img:2,h2:'Friendly',h3:'DEVIL'},
    {img:3,h2:'Tranquilent',h3:'COMPATRIOT'},
    {img:4,h2:'Insecure',h3:'HUSSLER'},
    {img:5,h2:'Loving',h3:'REBEL'},
    {img:6,h2:'Passionate',h3:'SEEKER'},
    {img:7,h2:'Crazy',h3:'FRIEND'}
];

//通用函数
var g = function(id){
    if(id.substr(0,1) == '.'){
        return document.getElementsByClassName(id.substr(1));
    }
    return document.getElementById(id);
};

//添加幻灯片以及控制按钮
function addSliders(){
    //获取模版,同时去掉头尾的空白符
    var tpl_main = g('template-main').innerHTML.replace('/^\s*/','').replace('/\s*$/','');
    var tpl_ctrl = g('template-ctrl').innerHTML.replace('/^\s*/','').replace('/\s*$/','');

    //定义最终输出的HTML变量
    var out_main = [];
    var out_ctrl = [];

    //遍历所有数据，构建最终输出的HTML
    for(var i in data){
        var _html_main = tpl_main.replace(/{{index}}/g,data[i].img)
            .replace(/{{h2}}/g,data[i].h2).replace(/{{h3}}/g,data[i].h3);
        var _html_ctrl = tpl_ctrl.replace(/{{index}}/g,data[i].img);

        out_main.push(_html_main);
        out_ctrl.push(_html_ctrl);
    }

    //把HTML回写到对应的DOM里面
    g('template-main').innerHTML = out_main.join('');
    g('template-ctrl').innerHTML = out_ctrl.join('');

};

//幻灯片切换
function switchSlider(n){
    //获得要展现的幻灯片以及控制按钮
    var main = g('main-'+n);
    var ctrl = g('ctrl-'+n);

    //获得所有的幻灯片以及控制按钮
    var clear_main = g('.main-i');
    var clear_ctrl = g('.ctrl-i');
    //清除active样式
    for(var i=0;i<clear_ctrl.length;i++){
        clear_main[i].className = clear_main[i].className
        .replace(' main-i-active','');
        clear_ctrl[i].className = clear_ctrl[i].className
        .replace(' ctrl-i-active','');
    }

    //为当前幻灯片以及控制按钮附加样式
    main.className += ' main-i-active';
    ctrl.className += ' ctrl-i-active';

};
//动态调整图片的margin-top，使其垂直居中
function movePictures(){
    var pictures = g('.picture');
    for(var i=0;i<pictures.length;i++){
        pictures[i].style.marginTop = (-1*pictures[i].clientHeight/2) + "px";
    }
}
//定义何时幻灯片输出
window.onload = function(){
    addSliders();
    switchSlider(1);
    setTimeout(function(){
        movePictures();
    },100);
    
};