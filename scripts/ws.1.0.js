/*
 * 辰方科技前端通用JS
 * 版本:1.0
 * 创建:2018-12-26
 * 说明:必须引用公共js框架集
 */
function setmenuon(index) {  //移动端 
    var obj = $(".nav a");
    var oclass = $(obj[index]).attr("class");
    $(obj[index]).removeClass().addClass(oclass + "On");
}

function onlineLong(key, obj,rt) {  //获取在线时长:key-记录时间点Cookies名
    setInterval(function () {
        if (atlasttime === "") {
            atlasttime = cfjs.getAjax("getonlinelast", "key=" + key, 0, "/cFapi/");
        }
        obj.html(cfjs.calculationTim(atlasttime, rt));
    },1000);
}




function ToTop(){
    $(window).scroll(function(){
        if($(window).scrollTop()>300){
            $('#return-top').fadeIn(300);
        }
        else{$('#return-top').fadeOut(200);}
			
    });
    $('#return-top').click(function() {

        $('body,html').animate({ scrollTop: 0 }, 300);
        return false;

    });
}
