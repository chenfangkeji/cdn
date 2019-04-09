/*
 * 辰方科技JS框架
 * 版本:1.0
 * 创建:2019-2-18
 * 说明:必须引用JQ框架
 */

var scrw = $(window).width(),
    scrh = $(window).height(),
    animatTime = 800, //动画显示时间
    api = "/api",
    x = 0,
    y = 0,
    scriptsDebug = false,
    plusid = 0,
    plustype = "0",
    plusname = "",
    plusheight = 0,
    del = "#delId",
    changeKey = 0,
    changeTips = "",
    submitUrl = "",
    isbeforeSubmit = false,
    showplusmenu = false,
    atlasttime = "",
    viewImgObj = "",
    dokindex = "",
    doObj = "",
    msgTips = "", //msgTips 信息提示模式:2-提示模式
    disabledBtn = "", //要禁用的按钮
    _tipsBgColor = "#D0EEFF", //提示层标题背景色
    _boxBgColor = "#e8f7fc"; //提示层内容背景色

function mousePosition(ev) {
    if (ev.pageX || ev.pageY) {
        return { x: ev.pageX, y: ev.pageY };
    }
    else {
        return { x: ev.clientX + document.body.scrollLeft - document.body.clientLeft, y: ev.clientY + document.body.scrollTop - document.body.clientTop };
    }
}
function mouseMove(ev) { ev = ev || window.event; var mousePos = mousePosition(ev); x = mousePos.x; y = mousePos.y; }
document.onmousemove = mouseMove;

var cfjs = {
    'version': "1.3",
    'verinfo': '',
    'data': "",
    'dataUrl': "",
    'layerClose': function (index) {
        if (typeof index === "number")
            layer.close(index);
        else
            layer.closeAll(); //关闭所有层
    },
    'loading': function (tips) {
        if (this.browserIsMobile()) {
            if (typeof (tips) !== "undefined") {
                //loading带文字
                layer.open({
                    type: 2,
                    content: tips
                });
            } else {
                layer.open({ type: 2 });
            }
        } else {
            layer.load(1, { shade: 0.3 });
        }
    },
    'prompt': function (msg, msgType, time) {
        if (this.browserIsMobile()) {
            if (typeof (msgType) !== "string") msgType = "footer";
            if (typeof (time) === "undefined" || typeof (time) !== "number") time = 3;
            if (msgType === "msg")
                layer.open({ content: msg, skin: 'msg', time: time });
            else
                layer.open({ content: msg, skin: 'footer' });

        } else {
            layer.msg(msg);
        }
    },
    'alert': function (tips, content, btn, fun, parameter, icon) { //相当于js的Alert:tips-标题,content-内容,btn-按钮名字pc,fun点击按钮后的执行的函数pc,parameter-执行参数pc,icon-图标pc
        if (this.browserIsMobile()) {
            //底部提示
            layer.open({
                content: content,
                skin: 'footer'
            });
        } else {
            layer.alert(content,{ icon: setLayerIcon(icon), title: setLayerTips(tips), closeBtn: 0 },
                function (index) {
                    if (cfjs.IsFunction(fun)) {
                        fun(parameter);
                    } else {
                        layer.closeAll();
                    }
                });
        }
    },
    'ask': function (tips, icon, content, btnAtxt, btnBtxt, funA, funB, paramA, paramB) { //询问框
        if (this.browserIsMobile()) {
            layer.open({
                content: content,
                btn: [btnAtxt, btnBtxt],
                yes: function (index) {
                    if (cfjs.IsFunction(funA)) {
                        funA(paramA);
                    } else {
                        layer.closeAll();
                    }
                },
                no: function (index) {
                    if (cfjs.IsFunction(funB)) {
                        funB(paramB);
                    } else {
                        layer.close(index);
                    }
                }
            });
        } else {
            layer.confirm(content,
                {
                    btn: [btnAtxt, btnBtxt],
                    icon: setLayerIcon(icon),
                    title: setLayerTips(tips),
                    closeBtn: 0
                },
                function () {
                    if (cfjs.IsFunction(funA)) {
                        funA(paramA);
                    } else {
                        layer.closeAll();
                    }
                },
                function () {
                    if (cfjs.IsFunction(funB)) {
                        funB(paramB);
                    } else {
                        layer.closeAll();
                    }
                });
        }
    },
    'iframe': function (tips, content, width, height, tipsStyle, shadecanclose) {//iframe层
        if (typeof tipsStyle === "string") tips = [tips, tipsStyle];
        layer.open({
            type: 2,
            title: tips,
            shadeClose: shadecanclose,
            shade: 0.8,
            area: [width + 'px', height + 'px'],
            content: content
            //            scrollbar: false
        });
    },
    'content': function (tips,cotent, width, heigth, canClose,tipsBgColor,bgColor) {//Layer页面层
        if (typeof canClose === "undefined") canClose = 1; //
        if (typeof tipsBgColor === "undefined") tipsBgColor = _tipsBgColor;
        if (typeof bgColor === "undefined") bgColor = _boxBgColor;
        layer.open({
            type: 1, title: [tips,"background:" + tipsBgColor],
            //skin: 'layui-layer-rim', //加上边框
            closeBtn: canClose,
            btn: ['关闭'],
            btnAlign: 'c',
            area: [width + 'px', heigth + 'px'], //宽高
            content: cotent
        });
    },
    'layerCloseLast': function () { //关闭最新弹出的层，直接获取layer.index即可
        layer.close(layer.index);
    },
    'wlgl': function (url) { //当前页面跳转
        window.location.href = url;
        return false;
    },
    'wpgl': function (url) { //父页面跳转
        window.parent.location.href = url;
    },
    'goBack': function (s) { //页面后退
        history.go(s);
    },
    'wlrl': function () { //刷新当前面
        window.location.reload();
    },
    'wprl': function () { //刷新父前面
        window.parent.location.reload();
    },
    'gRand': function () { //生成随机数
        return Math.floor(Math.random() * 100000 + 1);
    },
    'getApi': function (r, key, url, rt) {
        if (typeof url === "undefined" || url.length < 1) url = api;
        if (scriptsDebug) {
            console.log("getApi-Url:" + url);
        }
        if (url.indexOf("?") < 0) url += "?";
        if (typeof rt !== "number") rt = 0; //rt=1,要求返回json
        url += "r=" + r;
        if (key.length > 0) url += "&" + key;
        return url + "&rt=" + rt + "&rnd=" + this.gRand();
    },
    'getJson': function (r, key, debug, url) {
        return this.getAjax(r, key, debug, url, 1);
    },
    'getAjax': function (r, key, debug, url, rt) {
        if (typeof (debug) !== "number") debug = 0;
        url = this.getApi(r, key, url, rt);
        if (debug === 1) this.wlgl(url);
        if (debug === 2) window.open(url);
        if (debug === 0) {
            key = $.ajax({ url: url, type: 'POST', async: false, cache: false }).responseText;
            if (rt === 1) key = eval('(' + key + ')'); //  jQuery.parseJSON(key);
            return key;
        }
    },
    'strIsok': function (strName) { //判断变量是否有效
        return (typeof (strName) === "undefined") ? false : true;
    },
    'strEngthen': function (str) { //强化函数            
        str = this.randStr(4) + str + this.randStr(4);
        return str;
    },
    'strRand': function (len) { //生成随机数
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var str = '';
        for (i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    },
    'strLenCheck': function (str, min, max) {
        if (str.length < 1) return 1;
        if (str.length <= max || str.length >= min) return 0;
        return 2;
    },
    'isEmail': function (email) {
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        return reg.test(email);
    },
    'isMobile': function (phone) { //移动电话号码
        var reg = /^1([38]\d|4[57]|5[0-35-9]|7[0-8]|8[89])\d{8}$/;
        return reg.test(phone);
    },
    'isCardNo': function (card) { //身份证号码
        var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return pattern.test(card);
    },
    'toDecimal2': function (x) {
        var f = parseFloat(x);
        if (isNaN(f)) return false;
        f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    },
    'toJson': function (obj) {
        return obj.length > 0 ? eval('(' + obj + ')') : "";
    },
    'IsFunction': function (obj) { //判断给定对像是否为函数
        return typeof obj === "function" ? true : false;
    },
    'htmlDisabled': function (obj) { //元素禁止点击或禁用
        obj.attr("disabled", "disabled");
    },
    'htmlEnable': function (obj) {
        obj.removeAttr("disabled");
    },
    'browserIsMobile': function () { //是否移动端浏览器
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) === "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) === "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) === "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) === "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) === "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) === "android";
        var bIsCE = sUserAgent.match(/windows ce/i) === "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) === "windows mobile";
        if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
            return false;
        } else {
            return true;
        }
    },
    'calculationTim': function (date, rt) { //计算时间差
        if (typeof (rt) === "undefined") rt = "0";
        var date2 = new Date(); //当前时间  
        var date3 = date2.getTime() - new Date(date).getTime(); //时间差的毫秒数   
        var days = Math.floor(date3 / (24 * 3600 * 1000));
        var leave1 = date3 % (24 * 3600 * 1000);                 //计算天数后剩余的毫秒数  
        var hours = Math.floor(leave1 / (3600 * 1000));
        var leave2 = leave1 % (3600 * 1000);                    //计算小时数后剩余的毫秒数  
        var minutes = Math.floor(leave2 / (60 * 1000));
        var leave3 = leave2 % (60 * 1000);                      //计算分钟数后剩余的毫秒数  
        var seconds = Math.round(leave3 / 1000);
        date3 = "";
        if (days > 0) date3 = days + "天";
        date3 += hours > 9 ? hours + "时" : "0" + hours + "时";
        date3 += minutes > 9 ? minutes + "分" : "0" + minutes + "分";
        date3 += seconds > 9 ? seconds + "秒" : "0" + seconds + "秒";
        if (rt === "1") {
            date3 = date3.replace("天", "");
            date3 = date3.replace("时", "");
            date3 = date3.replace("分", "");
            date3 = date3.replace("秒", "");
        }
        if (rt === "2") {
            date3 = date3.replace("天", "D");
            date3 = date3.replace("时", "H");
            date3 = date3.replace("分", "M");
            date3 = date3.replace("秒", "S");
        }
        return date3;
    },
    'ValidFormBound': function (vfObj, vfdataType, vfNullmsg, vfErrmsg, vfSucmsg, vfRecheck, vRIs, vRValue, vRErrmsg, vRUrl, vRTmpUrl) {//表单提交验证控件绑定 vfObj-控件对像(JQ),vfdataType-验证类型,vfNullmsg-为空时提示信息(placeholder > tipsplaceholder),vfErrmsg-错误时提示信息(vfErrmsg >vfNullmsg ),vfSucmsg-正确时提示信息,vfRecheck-重复校验对像(控件name),vRis-是否实时验证值,vRValue-实时验证参数(参数名=参数值&参数名=参数值),vRErrmsg-实时验证错误信息,vRUrl-实时验证地址(不能带参数,以/结束),vfTmpUrl-跳转检测实地址

        if (scriptsDebug) { console.log("cfjs-ValidFormBound-vfObj:" + vfObj); }
        if (typeof vfdataType !== "string" || vfdataType.length < 1) vfdataType = "*";
        if (typeof vfNullmsg !== "string") vfNullmsg = "";
        if (typeof vfErrmsg !== "string") vfErrmsg = "";
        if (typeof vfSucmsg !== "string") vfSucmsg = "";

        if (vfNullmsg.length < 2) {
            if (typeof vfObj.attr("placeholder") === "undefined") {
                if (typeof vfObj.attr("tipsplaceholder") !== "undefined") vfNullmsg = vfObj.attr("tipsplaceholder");
            } else {
                vfNullmsg = "请填写" + vfObj.attr("placeholder");
            }
        }
        this.appendvalidform(vfObj);
        //if (vfNullmsg.indexOf("同意") < 0 && vfNullmsg.indexOf("输入") < 0) vfNullmsg = "请填写" + vfNullmsg;
        vfObj.attr("nullmsg", vfNullmsg).attr("datatype", vfdataType);
        if (vfErrmsg.length < 1) {
            vfErrmsg = vfNullmsg;
        }
        else {
            if (vfErrmsg.indexOf("不一致") < 0) vfErrmsg = "请填写" + vfErrmsg;
        }
        vfObj.attr("errormsg", vfErrmsg);
        if (this.strIsok(vfRecheck) && vfRecheck.length > 1) { vfObj.attr("recheck", vfRecheck); }
        if (this.strIsok(vfSucmsg) && vfSucmsg.length > 0) { vfObj.attr("sucmsg", vfSucmsg); }
        if (vRIs) this.ValidFormRealTime(vfObj, vRValue, vRErrmsg, vRUrl, vRTmpUrl);
    },
    'appendvalidform': function (obj) {//表单验证附加提示框
        obj.after("<div class=\"Validform\"><div class=\"info\"><span class=\"Validform_checktip\"></span><span class=\"dec\"><s class=\"dec1\">&#9670;</s><s class=\"dec2\">&#9670;</s></span></div></div>");
    },
    'ValidFormRealTime': function (vfObj, vfValue, vfErrmsg, vfUrl, vfTmpUrl) { //表单验证-控件值实时验证 vfObj-控件对象(JQ),vfValue-实时验证附回参数列,vfErrmsg-验证不通过时提示信息,vfUrl-自定义验证地址(为空时为api设置地址,不能带参数,以/结束),vfTmpUrl-跳转检测实地址

        console.log("vfErrmsg=" + vfErrmsg + ",vfErrmsgLen=" + vfErrmsg.length);

        if (vfErrmsg.length < 5) {
            var placeholder = vfObj.attr("placeholder");
            console.log(placeholder);

            if (placeholder.length < 1) {
                if (typeof vfObj.attr("tipsplaceholder") !== "undefined") vfErrmsg = vfErrmsg + vfObj.attr("tipsplaceholder");
            } else {
                vfErrmsg = vfErrmsg + placeholder;
            }
        }
        console.log("vfErrmsg=" + vfErrmsg + ",vfErrmsgLen=" + vfErrmsg.length);
        var tmpUrl = typeof vfUrl !== "undefined" && vfUrl.length > 2 ? vfUrl + "?" : ajaxurl + "?r=formvaild&";
        tmpUrl += vfValue !== "" ? vfValue + "&msg=" + encodeURIComponent(vfErrmsg) : "msg=" + encodeURIComponent(vfErrmsg);

        tmpUrl += "&rnd=" + this.gRand();
        if (typeof vfTmpUrl !== "undefined") {
            tmpUrl += "&vaildUrl=" + encodeURIComponent(vfTmpUrl + "?" + vfValue);
        }
        vfObj.attr('ajaxurl', tmpUrl);
    },
    'GetUrlParam': function (UrlParam) {
        var aHref = window.location.href;
        var aQuery = aHref.split("?");//取得Get参数
        aHref = "";
        if (aQuery.length > 1) {
            var aBuf = aQuery[1].split("&");
            for (var i = 0; i < aBuf.length; i++) {
                if (aBuf[i].length > 0) {
                    var aTmp = aBuf[i].split("="); //分离key与Value
                    if (aTmp[0].toLowerCase() === UrlParam.toLowerCase()) {
                        aHref = aTmp[1];
                        i = aBuf.length;
                    }
                }
            }
        }
        return aHref;
    },
    'SetDatePicker': function(obj) {
        obj.addClass("Wdate");
    }
}

function setLayerIcon(icon) {//icon:0-叹号,1-√,2-错误,3-问号,4-锁定,5-哭脸,6-笑脸 
    switch (icon) {
        case "right":
        case "0":
        case "ok": icon = "1"; break;
        case "1":
        case "error": icon = "2"; break;
        case "help": icon = "0"; break;
        case "lock": icon = "4"; break;
        case "ask": icon = "3"; break;
        case "smile": icon = "6"; break;
    }
    return icon;
}
function setLayerTips(tips) { return tips || "操作提示"; }

var cfjsLanguePack = {
    'G': function (key, min, max, t, r, o) {//key-提示字,min-下限值,max-上限制,t-type(s-字会,n-数字),r-提示方式:1-空,2-错误
        if (r === 1) return "请填写" + key;
        if (r === 2) {
            if (t === "s") return this.strLen(key, min, max);
            if (t === "n") return this.numLen(key, min, max);
        }
        if (typeof (o) === "object") o.addClass("error");
    },
    'strLen': function (key, min, max) { return key + "长度为[" + this.LenSet(min, max) + "]个字符"; },
    'numLen': function (key, min, max) { return key + "长度为[" + this.LenSet(min, max) + "]个数字"; },
    'LenSet': function (min, max) {
        return min === max ? min : min + "-" + max;
    }
};
