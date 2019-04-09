/*
 * 辰方科技后台管理框架JS
 * 版本:1.0
 * 创建:2018-12-26
 * 说明:必须引用公共js框架集和前端JS
 */

function GetCsaf() {
    var myMainForm = $("#MainForm");
    if (myMainForm.length > 0) {
        var scrWPix = scrw; //$.query.get("scrWPix");
        var scrHPix = scrh; //$.query.get('scrHPix');
        var mainTopHeight = $(".mainTop").height();

       // //计算框架顶部布局
       // var mainTopWidth = $(".mainTop").width();
       // var maintoprightWidth = mainTopWidth - $(".maintopleft").width();
       //// $(".maintopright").css("width", maintoprightWidth + "px");

        var mainLeftHeight = scrHPix - mainTopHeight;  //下部高度11········
        $(".mainLeft").css("height", mainLeftHeight);   //左侧中间区域高度
        var lw1 = $(".mainLeftw").width(), lw2 = $(".mainLeft").width();
        var rw = scrWPix - lw1 - lw2;
        $(".mainRight").css("width", rw);//右侧宽度
        $(".mainleftdiv").css("height", mainLeftHeight);
        $(".mainRight .frInterface").css({ "height": (mainLeftHeight - 30), "width": (rw - 10) + "px" });
        $(".mainrightframe").css({ "height": (mainLeftHeight - 30) + "px", "width": (rw - 10) + "px" });

        $(".mainLeftMenu").css("height", mainLeftHeight);   //菜单显示区域总高度  




        //  //初始化菜单显示
        var menuGroup = $(".menugroup");
        var Hspan = menuGroup.find("span").height();
        for (var i = 0; i < menuGroup.length; i++) {
            $(menuGroup[i]).css("height", Hspan + 17);
            $(menuGroup[i]).find("ul").hide();
        }

        var menu_Height = menuGroup.length * (Hspan + 17);
        //menugroup 计算操作菜单下UL的高度
        var menugroup_span_height = 32;
        var menugroup_UL_Height = mainLeftHeight - menugroup_span_height * menuGroup.length;

        //菜单点击操作
        $(".menugroup li").click(function () {
            var myli = $(".menugroup li");
            for (var i = 0; i < myli.length; i++) {
                $(myli[i]).removeClass("on");
            }
            $(this).addClass("on");
        });

        $(".menugroup span").click(function () {
            for (var i = 0; i < menuGroup.length; i++) {
                $(menuGroup[i]).animate({ height: menugroup_span_height }, "1000");
                $(menuGroup[i]).find("span").removeClass("on");
            }
            var ul = $(this).parent().find("ul");
            var li = ul.find("li");
            var ulHeight = li.length * 33;//每个li高度是33;
            var aHeight = ulHeight + menu_Height;
            if (aHeight < mainLeftHeight) aHeight = mainLeftHeight + 60;
            $(".mainLeftMenu").css("height", aHeight - 60);
            ul.css("height", ulHeight).show();
            $(this).parent().animate({ height: menugroup_span_height + ulHeight + 5 }, "1000");
            $(this).addClass("on");
        });
        var vac = $(".menugroup span");
        if (vac.length > 0) $(vac[0]).click();

        $(".MainForm").show();

        $(".adminlogout").on("click",
            function () {
                cfjs.ask("", "ask", "您确定退出管理系统吗？<br/>退出后，未保存或未提交的数据将失效并无法恢复。", "确定", "取消", loginout, "", "", "");
            });

        //计算默认显示条数
        var rowBoxHeight = scrh - 260;
        var row = parseInt(rowBoxHeight / 41);
        cfjs.getAjax("reportpagesize", "key=" + row, 0, "/cfApi");
           
       

        //计算在线时间
       // onlineLong("adminlogintime", $(".onlinelong"), 2);

        var kjs = setInterval(function () {

            var ck = cfjs.getJson("checkadminout", "", 0, "/cFapi/");
            if (scriptsDebug) console.log(ck + ",cklen=" + ck.length);

            if (ck.res === "1") {
                sReturnAlert('{"res":"1","result":"' + ck.result + '"}', 'logintimeout');
                clearInterval(kjs);
            } else {
                ck = ck.result.split(",");
              //  console.log(ck);
                $(".onlinelong").html("在线：" +  cfjs.calculationTim(ck[0], 2) + "，上次操作：" + ck[1]);
            }
        },
           500);
    }
}

function getkindex(kindex) {
    var dm = $("#menuLi" + kindex + " a").attr("href");
    if (typeof dm === "undefined") {
        kindex++;
        dm = $("#menuLi" + kindex + " a").attr("href");
    }
    $("#mainright").attr("src", dm);
}

function layoutSet(parameters) {//管理操作页，内联操作函数
    $(".fromTable").width($(".MainForm").width() - 30);//格化式主表格宽度
    var gw = $(".fromTable").width();

    $("#verTips").on("click", function () {//弹出模块更新说明信息
        var obj = cfjs.getJson("", "menu=getverinfo", 0, "?");
        cfjs.layerTips(obj.v + "<br />" + obj.t + "<br />" + obj.b, "verTips", "2", 9);
    });
    if ($("#dokindex").length > 0) dokindex = $("#dokindex").val();

    if ($(".plusBox").length > 0) {
        plusheight = $(".plusBox").height();
        //  $(".plusBox").css({ height: '0px', width: '0px', display: 'inherit' });
    }

    setPlusMenu();//修正plusmenu菜单


    if ($("form").length < 1) { //列表脚本
        clayoutList();
    }

    if ($("form").length > 0) {  //添加脚本
        $(".fv").width(gw);

        $("input[disabled='']").removeProp("disabled");
       


    }
}

function clayoutList() {
    $(".RunState").on("change", function () {//上架状态变更 快捷操作 2019-01-19 by Jack
        plusid = $(this).attr("data-id").substr(2); changeTips = "上架状态"; doObj = $(this);
        cfjs.ask("操作提示", "ask", "确定将[<b class=\"cRed\">序列-" + plusid + "</b>]的数据" + changeTips + "变更为-<b class=\"cRed\">" + $(this).find("option:selected").text() + "</b>吗？", "确定", "取消", GoStateChange, "", $(this).attr("data-id").substr(0, 2) + "id=" + plusid + "&change=" + $(this).val(), "");
    });
    $(".AccState").on("change", function () {//审核状态变更 快捷操作 2019-01-23 by Jack
        plusid = $(this).attr("data-id").substr(2); changeTips = "运营状态"; doObj = $(this);
        cfjs.ask("操作提示", "ask", "确定将[<b class=\"cRed\">序列-" + plusid + "</b>]的数据" + changeTips + "变更为-<b class=\"cRed\">" + $(this).find("option:selected").text() + "</b>吗？", "确定", "取消", GoStateChange, "", $(this).attr("data-id").substr(0, 2) + "id=" + plusid + "&change=" + $(this).val(), "");
    });

    if ($("#btnDel").length < 1) {
        cfjs.htmlDisabled($(".delId"));
        $(".delId").hide();
    }
    //计算列表表格自适应的宽度
    var t = $("thead th"), w = 0, j = 0;
    for (var i = 0; i < t.length; i++) {
        var cw = $(t[i]).attr("class");
        if (cw !== "auto") {
            w = w + $(t[i]).width();
            j++;
        }
    }

    var tgw = $(".gv").attr("data-tgw");
    if (typeof (tgw) !== "undefined") gw = tgw;

   // $(".gv").width(gw);

    gw = $(".gv").width();

    w = parseInt(gw) - parseInt(w) + parseInt(j * 20);
    t = $("tbody .auto");
    for (i = 0; i < t.length; i++) { $(t[i]).css("width", w); }

    //显示预览图标
    var imgCover = $(".imgCover");

    for (i = 0; i < imgCover.length; i++) {
        var k = $(imgCover[i]).attr("data-img");
        if (typeof k !== "undefined" && k.length > 5) $(imgCover[i]).addClass("ico img");
    }

    $(".gv").show();
    bmcpKc.setPageList("#inPage");


    //列表 缩略图点击
    $(".imgCover").hover(function () {
        //<div class="imgpop" style="left: 342px; top: 267px; display: none;"></div>
        var imgpop = $(".imgpop");
        var img = "<img src=\"" + $(this).attr("data-img") + "\" alt=\"\" />";
        if ($(this).attr("data-img").length < 5) return;

        if (imgpop.length < 1) {
            $("body").append("<div class=\"imgpop\"></div>");
            imgpop = $(".imgpop");
        }
        imgpop.html(img).css({ "left": (x + 5) + "px", "top": (y + 5) + "px" }).show();

    }).mouseleave(function () {
        $(".imgpop").html("").hide();
    });


}

function GoStateChange(change) {
    changeKey = change.substr(0, 2);
    change = change.substr(2);
    change += "&Menu=" + changeKey;
    changeTips = "[序列-" + plusid + "]的数据" + changeTips + "变更操作-";
    change = cfjs.getJson("", change, 0, "?");
    //cfjs.prompt(changeTips + change.result);
    var icon = "error";
    if (change.res === "0") {
        cfjs.htmlDisabled(doObj);
        icon = "ok";
    }
    cfjs.alert("", changeTips + change.result, "确定", "", "", icon);
}

function sReturnAlert(k, rck, errmode) { //k-操作/结果Json,rck-操作关键字优先于k,errmode-错误模式
    if (k.length < 1 || typeof (k) === "undefined") return false;

    if (typeof rck === "undefined") rck = "";
    if (typeof errmode === "undefined") errmode = "";
    if (typeof k !== "object") k = cfjs.toJson(k);

    if (rck === "logintimeout") {
        if (k.res === "1") cfjs.alert("操作提示", "登陆超时，请重新登陆！", "确定", cfjs.wlgl, k.result, 4);
        if (k.res === "2") window.parent.cfjs.alert("操作提示", "登陆超时，请重新登陆！", "确定", window.parent.cfjs.wlgl, k.result, 4);
        return false;
    }
    if (rck === "goback") {
        if (k.res === "1") cfjs.alert("操作提示", k.result, "确定", cfjs.goBack, "-1", 4);
        return false;
    }
    var a = "?Menu=1", b = "?Menu=2";
    if (rck.length > 0) {
        a = a + "&" + rck;
        b = b + "&" + rck;
    }
    if (k.res === "1") {
        cfjs.alert("操作提示", k.result, "确定", "", "", 4);
        return false;
    }
    if (k.res === "9") {
        cfjs.alert("操作提示", k.result, "确定", "", "", "ok");
        return false;
    }
    if (k.res === "7") { //刷新
        cfjs.alert("操作提示", k.result, "确定", cfjs.WLRL, "", "ok");
        return false;
    }
    if (k.res === "8") { //刷新
        cfjs.alert("操作提示", k.result, "确定", goSetup, "", "ok");
        return false;
    }
    if (k.res === "0") {
        switch (msgTips) {
            case 2:
                cfjs.prompt(k.result);
                if (typeof disabledBtn !== "undefined") disabledBtn.attr("disabled", "disabled");
                break;

            default:
                cfjs.ask("操作提示", 1, decodeURI(k.result),"继续操作","管理列表",window.parent.getkindex,window.parent.getkindex,dokindex--,dokindex);
                break;
        }
        return false;
    }
}

function cplusbox(obj, c, id, name,t) {
    var _w = 125;
    if (c === "0") {
        $("." + obj).show().animate({ height: plusheight + "px", width: _w + 'px', top:(y + 5) + "px", right:(scrw - x + 5) + "px" }, 500);
        plusid = id;
        plusname = name;
        plustype = t;
    }
    else
        $("." + obj).animate({ height: '0px', width: '0px', top: "0px", right: "0px" }).fadeOut(500);
}

function getAttachmentPage() {
    window.parent.cfjs.iframe("附件操作-" + plusname + "[" + plusid + "]", "/NsAttachment/CIndex?AttachmentAsItem=" + plustype + "&projectName=" + plusname + "&AttachmentAsID=" + plusid + "&rnd=" + cfjs.gRand(), 700, 600);
}

function GoToWebForm(webUrl, webTitle, webWidth, webHeight) {
    cfjs.iframe(webTitle + "-" + plusname + "[" + plusid + "]", webUrl + "&objType=" + plustype + "&objName=" + plusname + "&objId=" + plusid + "&rnd=" + cfjs.gRand(), webWidth, webHeight,false);
}

function setPlusMenu() {  //修正plusmenu菜单

    if (scriptsDebug) {
        console.log("setPlusMenu-plusmenu-a-Len:" + $(".plusmenu a").length);
        console.log("setPlusMenu-isdel:" + isdel);
    }

    if ($(".plusmenu a").length < 1) return false;
    if ($(".plusmenu a").length === 1) {
        $(".plusmenu").fadeIn(animatTime);
         return false;
    }

    var kindex = cfjs.GetUrlParam("kindex"), isdel = cfjs.GetUrlParam("isdel"), tabId = 0;
    if (scriptsDebug) {
        console.log("setPlusMenu-kindex:" + kindex);
        console.log("setPlusMenu-isdel:" + isdel);
    }

    if (typeof isdel === "undefined" || isdel === null || typeof isdel === undefined || isdel.length < 1) isdel = "0";
    var tab = $(".plusmenu .tabMenu");
    

    switch (isdel) {
        case "1": tabId = 2; break;
        case "0": tabId = 1; break;
        default: tabId = 0; break;
    }
   
    if (scriptsDebug) {
        console.log("setPlusMenu-tabId:" + tabId);
        console.log("setPlusMenu-isdel:" + isdel);
    }

    $(tab[tabId]).removeClass("btn-info").addClass("btn-danger");


    var aHref = window.location.href;
    var aQuery = aHref.split("?");//取得Get参数
    if (aQuery.length > 1) {
        aHref = "";
        var aBuf = aQuery[1].split("&");
        for (var i = 0; i < aBuf.length; i++) {
            if (aBuf[i].length > 0) {
                var aTmp = aBuf[i].split("=");//分离key与Value
                var key = aTmp[0];
                key = key.toLowerCase();
                if (key !== "isdel" && key !=="xstate") {
                    aHref = aHref + "&" + aBuf[i];
                }
            }
        }
    }
    if (aHref.length > 0) {
        aHref = aHref.substr(1);
        aHref = aQuery[0] + "?" + aHref + "&";
    } else {
        aHref = aQuery[0] + "?";
    }
    for (var j = 0; j < tab.length; j++) {
        if (j === 0) $(tab[j]).attr("href", aHref + "isdel=-1&xState=");
        if (j === 1) $(tab[j]).attr("href", aHref + "isdel=0&xState=1");
        if (j === 2) $(tab[j]).attr("href", aHref + "isdel=1");
    }
    $(".plusmenu").fadeIn(animatTime);
}

var bmcpKc = {
    "setPageList": function (objPage) {  //页列表与跳转操作 2019-02-13 by Jack    objPage-页跳转对像 
        $(objPage).on('change',
            function () { //跳页
                var aHref = window.location.href;
                var page = parseInt($(this).val()) + parseInt(1);

                var aQuery = aHref.split("?"); //取得Get参数
                // var aGET = new Array();
                var isaddpage = false;
                if (aQuery.length > 1) {
                    aHref = "";
                    var aBuf = aQuery[1].split("&");
                    for (var i = 0; i < aBuf.length; i++) {
                        if (aBuf[i].length > 0) {
                            var aTmp = aBuf[i].split("="); //分离key与Value
                            if (aTmp[0].toLowerCase() === "page") {
                                aHref = aHref + "&page=" + page;
                                isaddpage = true;
                            } else {
                                aHref = aHref + "&" + aBuf[i];
                            }
                        }
                    }
                }
                if (aHref.length > 0) aHref = aHref.substr(1);
                aHref = aQuery[0] + "?" + aHref;
                if (!isaddpage) {
                    if (aHref.indexOf("?") > 0)
                        aHref = aHref + "&page=" + page;
                    else
                        aHref = aHref + "?page=" + page;
                }
                cfjs.wlgl(aHref);
            });
        $(objPage).val($(objPage).attr("dpage"));
    }
}

function checkRequest() {
    if (isbeforeSubmit) {
        window.open(submitUrl + encodeURI($("form").serialize()));
        return false;
    } else {
        return true;
    }
}
function formsubmit() {
    $("form").ajaxSubmit({
        beforeSubmit: checkRequest,
        type: 'post', url: submitUrl, datatype: "json",
        success: function (data) {
            if (cfjs.toJson(data).res === "1")
                sReturnAlert(data, "", "2");
            else
                sReturnAlert(data);
        }
    });
    return false;
}
