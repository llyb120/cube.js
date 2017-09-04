dom = [];
dom.isReady = false;
dom.isFunction = function(obj) {
    return Object.prototype.toString.call(obj) === "[object Function]";
}
dom.Ready = function(fn) {
    dom.initReady(); //如果没有建成DOM树，则走第二步，存储起来一起杀
    if (dom.isFunction(fn)) {
        if (dom.isReady) {
            fn(); //如果已经建成DOM，则来一个杀一个
        } else {
            dom.push(fn); //存储加载事件
        }
    }
}
dom.fireReady = function() {
    if (dom.isReady) return;
    dom.isReady = true;
    for (var i = 0, n = dom.length; i < n; i++) {
        var fn = dom[i];
        fn();
    }
    dom.length = 0; //清空事件
}
dom.initReady = function() {
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function() {
            document.removeEventListener("DOMContentLoaded", arguments.callee, false); //清除加载函数
            dom.fireReady();
        }, false);
    } else {
        if (document.getElementById) {
            document.write("<script id=\"ie-domReady\" defer='defer'src=\"//:\"><\/script>");
            document.getElementById("ie-domReady").onreadystatechange = function() {
                if (this.readyState === "complete") {
                    dom.fireReady();
                    this.onreadystatechange = null;
                    this.parentNode.removeChild(this)
                }
            };
        }
    }
}
module.exports = dom;