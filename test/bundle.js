/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var widget_1 = __webpack_require__(5);
var domready = __webpack_require__(6);
var Cube = (function () {
    function Cube() {
        this.$data = {};
        this.$widgets = [];
        this.$observer = {};
        // each(obj : any[] | any,callback : Function){
        //     if(Array.isArray(obj)){
        //         for(let i = 0; i < obj.length; i++){
        //             callback.call(null,i,obj[i]);   
        //         }
        //     }
        //     else{
        //         for(let i in obj){
        //             callback.call(null,i,obj[i]);
        //         }
        //     }
        // }
    }
    Cube.prototype.start = function () {
        var _this = this;
        domready.Ready(function () {
            var elems = document.querySelectorAll("[c-tpl]");
            for (var i = 0; i < elems.length; i++) {
                _this.$widgets.push(new widget_1.Widget(elems[i]));
                // var vdom = scan(<HTMLElement>elems[i]);
                // log(vdom);
            }
            _this.startToObserve();
        });
    };
    Cube.prototype.set = function (key, val) {
        this.$data[key] = val;
    };
    Cube.prototype.get = function (key) {
        return this.$data[key] || null;
    };
    Cube.prototype.startToObserve = function () {
        var _this = this;
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        if (!requestAnimationFrame) {
            requestAnimationFrame = function (fn) { return setTimeout(fn, 17); };
        }
        var start = null;
        var timelimit = 0;
        var step = function (timestamp) {
            if (start === null)
                start = timestamp;
            var progress = timestamp - start;
            timelimit += 17;
            if (timelimit > 50) {
                timelimit = 0;
                _this.$widgets.forEach(function (widget) {
                    //如果上一个时间点已经确定需要渲染，那么不进行脏检测，直接重新渲染
                    do {
                        if (widget.needToRerender) {
                            if (widget.delay) {
                                widget.delay = false;
                                break;
                            }
                            widget.needToRerender = false;
                            widget.render();
                            return;
                        }
                    } while (0);
                    var key = widget.dataKey;
                    var json = JSON.stringify(_this.$data[key]);
                    //当脏检测触发的时候，推迟到下一个时间点进行渲染，降低单一渲染的压力
                    if (json != _this.$observer[key]) {
                        widget.needToRerender = true;
                        widget.delay = true;
                        _this.$observer[key] = json;
                    }
                });
            }
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    return Cube;
}());
exports.Cube = Cube;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
function log() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    try {
        console.log.apply(null, args);
    }
    catch (e) {
    }
}
exports.log = log;
function isSpace(str) {
    return /^[\s\n\r\t]+$/.test(str) || str == "";
}
exports.isSpace = isSpace;
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.clone = clone;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function (searchElement /*, fromIndex*/ ) {
        'use strict';

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var n, k,
            t = Object(this),
            len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }

        n = len - 1;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) {
                n = 0;
            } else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }

        for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {

        var k;

        // 1. Let o be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let lenValue be the result of calling the Get
        //    internal method of o with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = o.length >>> 0;

        // 4. If len is 0, return -1.
        if (len === 0) {
            return -1;
        }

        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = fromIndex | 0;

        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }

        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the
            //    HasProperty internal method of o with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            //    i.  Let elementK be the result of calling the Get
            //        internal method of o with the argument ToString(k).
            //   ii.  Let same be the result of applying the
            //        Strict Equality Comparison Algorithm to
            //        searchElement and elementK.
            //  iii.  If same is true, return k.
            if (k in o && o[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function (callback /*, thisArg*/ ) {

        var T, k;

        if (this == null) {
            throw new TypeError('this is null or not defined');
        }

        // 1. Let O be the result of calling toObject() passing the
        // |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get() internal
        // method of O with the argument "length".
        // 3. Let len be toUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If isCallable(callback) is false, throw a TypeError exception. 
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let
        // T be undefined.
        if (arguments.length > 1) {
            T = arguments[1];
        }

        // 6. Let k be 0.
        k = 0;

        // 7. Repeat while k < len.
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //    This is implicit for LHS operands of the in operator.
            // b. Let kPresent be the result of calling the HasProperty
            //    internal method of O with argument Pk.
            //    This step can be combined with c.
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal
                // method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as
                // the this value and argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined.
    };
}

if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}


//addEventlistener
//ie8-eventlistener.js 
-
[1, ] || (function () {

    //为window对象添加 
    addEventListener = function (n, f) {

        if ("on" + n in this.constructor.prototype)

            this.attachEvent("on" + n, f);

        else {

            var o = this.customEvents = this.customEvents || {};

            n in o ? o[n].push(f) : (o[n] = [f]);

        };

    };

    removeEventListener = function (n, f) {

        if ("on" + n in this.constructor.prototype)

            this.detachEvent("on" + n, f);

        else {

            var s = this.customEvents && this.customEvents[n];

            if (s)
                for (var i = 0; i < s.length; i++)

                    if (s[i] == f) return void s.splice(i, 1);

        };

    };

    dispatchEvent = function (e) {

        if ("on" + e.type in this.constructor.prototype)

            this.fireEvent("on" + e.type, e);

        else {

            var s = this.customEvents && this.customEvents[e.type];

            if (s)
                for (var s = s.slice(0), i = 0; i < s.length; i++)

                    s[i].call(this, e);

        }

    };

    //为document对象添加

    HTMLDocument.prototype.addEventListener = addEventListener;

    HTMLDocument.prototype.removeEventListener = removeEventListener;

    HTMLDocument.prototype.dispatchEvent = dispatchEvent;

    HTMLDocument.prototype.createEvent = function () {

        var e = document.createEventObject();

        e.initMouseEvent = function (en) {
            this.type = en;
        };

        e.initEvent = function (en) {
            this.type = en;
        };
        return e;
    };

    //为全元素添加

    var tags = [

            "Unknown", "UList", "Title", "TextArea", "TableSection", "TableRow", "Table", "TableCol", "TableCell", "TableCaption", "Style", "Span",

            "Select", "Script", "Param", "Paragraph", "Option", "Object", "OList", "Meta", "Marquee", "Map", "Link", "Legend", "Label", "LI", "Input",

            "Image", "IFrame", "Html", "Heading", "Head", "HR", "FrameSet", "Frame", "Form", "Font", "FieldSet", "Embed", "Div", "DList", "Button", "Body", "Base", "BR", "Area", "Anchor"

        ],
        html5tags = [

            "abbr", "article", "aside", "audio", "canvas", "datalist", "details", "dialog", "eventsource", "figure", "footer", "header", "hgroup", "mark", "menu", "meter", "nav", "output", "progress", "section", "time", "video"

        ],
        properties = {

            addEventListener: {
                value: addEventListener
            },

            removeEventListener: {
                value: removeEventListener
            },

            dispatchEvent: {
                value: dispatchEvent
            }

        };

    for (var o, n, i = 0; o = window["HTML" + tags[i] + "Element"]; i++)

        tags[i] = o.prototype;

    for (i = 0; i < html5tags.length; i++)

        tags.push(document.createElement(html5tags[i]).constructor.prototype);

    for (i = 0; o = tags[i]; i++)

        for (n in properties) Object.defineProperty(o, n, properties[n]);

})();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var utils_1 = __webpack_require__(1);
var reg = /~([\s\S]+?)~/g;
var space = "[\\s\\n\\r\\t]*";
var notSpace = "[^\\s\\n\\r\\t]+";
var word = "[\\w]+";
exports.ifReg = /^if(.+)$/;
var elseifReg = new RegExp("^else" + space + "if(.+)$");
var elseReg = /^else(.*)$/;
exports.forReg = new RegExp("^(?:for|each)" + space + "(" + word + ")" + space + "(?:," + space + "(" + word + ")" + space + ")?in" + space + "(" + notSpace + ")$");
var endReg = /^end$/;
// export interface Expression{
//     expression : ForExpression | IfExpression,
//     objects : ASTNode[]
// }
/**
 * 生成抽象语法树
 * @param domNode
 * @param parentNode
 */
function generateASTTree(domNode, parentNode) {
    var nodes;
    //元素节点
    if (domNode.nodeType == 1) {
        var thisNode = {
            type: 'element',
            children: [],
            attributes: {},
            tagName: domNode.tagName
        };
        //遍历所有子元素
        for (var i = 0; i < domNode.childNodes.length; i++) {
            nodes = generateASTTree(domNode.childNodes[i], thisNode);
            thisNode.children = thisNode.children.concat(nodes);
        }
        //遍历所有属性节点
        for (var i = 0; i < domNode.attributes.length; i++) {
            var attrNode = domNode.attributes[i];
            thisNode.attributes[attrNode.nodeName] = attrNode.nodeValue;
        }
        // console.log(clone(thisNode.children));
        //规约子节点
        var stack = [];
        var values = [];
        for (var i = 0; i < thisNode.children.length; i++) {
            var item = thisNode.children[i];
            if (item.type != 'expression') {
                stack.push(item);
                continue;
            }
            var matched;
            if (matched = item.value.match(exports.ifReg)) {
                stack.push(null);
                values.push({
                    ifs: [
                        {
                            condition: matched[1],
                            nodes: []
                        }
                    ],
                    els: null
                });
            }
            else if (matched = item.value.match(exports.forReg)) {
                stack.push(null);
                var exp = {
                    key: matched[2] ? matched[1] : undefined,
                    value: matched[2] ? matched[2] : matched[1],
                    obj: matched[3]
                };
                values.push(exp);
            }
            else if (matched = item.value.match(elseifReg) || item.value.match(elseReg)) {
                var index = stack.lastIndexOf(null);
                if (index == -1) {
                    throw new Error('匹配不到对应的元素');
                }
                //补充上一个if元素的节点
                var targets = stack.slice(index + 1, stack.length);
                stack.splice(index + 1, stack.length);
                var top = values[values.length - 1];
                var ifs = top.ifs;
                ifs[ifs.length - 1].nodes = targets;
                //开辟下一个elseif
                //如果没有匹配到表达式，那么表示这是一个else
                if (matched[1].trim() == '') {
                    top.els = [];
                }
                else {
                    ifs.push({
                        condition: matched[1],
                        nodes: []
                    });
                }
            }
            else if (endReg.test(item.value)) {
                var index = stack.lastIndexOf(null);
                if (index == -1) {
                    throw new Error('匹配不到对应的元素');
                }
                var targets = stack.slice(index + 1, stack.length);
                var value = values.pop();
                //如果是逻辑表达式
                //1.当els为Null的时候，将node补充到ifs的栈顶
                //2.当els存在的时候，node补充到els
                if (value.ifs) {
                    if (value.els) {
                        value.els = targets;
                    }
                    else {
                        value.ifs[value.ifs.length - 1].nodes = targets;
                    }
                }
                stack.splice(index, stack.length);
                stack.push({
                    type: 'object',
                    value: '',
                    expInfo: value,
                    children: targets
                });
            }
            else {
                stack.push(item);
            }
        }
        thisNode.children = stack;
        return thisNode;
    }
    else if (domNode.nodeType == 3) {
        if (utils_1.isSpace(domNode.nodeValue)) {
            return [];
        }
        //拆分节点
        nodes = splitTextNode(domNode.nodeValue.trim());
        return nodes;
    }
    return [];
}
exports.generateASTTree = generateASTTree;
/**
 * 解析文本节点并生成语法树节点
 * @param value
 */
function splitTextNode(value) {
    var matched = (value).match(reg);
    if (!matched) {
        return [
            {
                type: "text",
                value: value,
                children: []
            }
        ];
    }
    value += '~';
    var start = 0;
    var ret = [];
    var strarr = [];
    var in_scope = false;
    for (var i = 0; i < value.length; i++) {
        var char = value[i];
        if (char == '~') {
            var text, isSpecial = false;
            if (in_scope) {
                text = (value.substring(start + 1, i)).trim();
                start = i + 1;
                isSpecial = true;
            }
            else {
                text = (value.substring(start, i)).trim();
                start = i;
            }
            in_scope = !in_scope;
            if (text == '') {
                continue;
            }
            ret.push({
                children: [],
                type: isSpecial ? 'expression' : 'text',
                value: text
            });
            // var tNode = new VDomNode(VDomNodeType.text);
            // tNode.text = text;
            // tNode.isSpecial = isSpecial;
            // if (isSpecial) {
            //     var forMatched;
            //     if (ifReg.test(tNode.text)) {
            //         tNode.expressionType = ExpressionType.ifexp;
            //         tNode.ifExpression = tNode.text.substr(2);
            //     }
            //     else if (forMatched = tNode.text.match(forReg)) {
            //         log('for matched is', forMatched);
            //         tNode.expressionType = ExpressionType.forexp;
            //         tNode.forExpression = {
            //             key: forMatched[1],
            //             value: forMatched[2],
            //             srouce: forMatched[3]
            //         };
            //     }
            //     else if (tNode.text == 'end') {
            //         tNode.expressionType = ExpressionType.endexp;
            //     }
            // }
            // ret.push(tNode);
        }
    }
    return ret;
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
function diff(oldNode, newNode) {
    var oldType = ('text' in oldNode) ? 'text' : 'element', newType = ('text' in newNode) ? 'text' : 'element';
    //类型都不相同的情况下，直接替换
    if (oldType !== newType) {
        return [
            {
                type: "modify",
                targets: [newNode],
                index: -1,
                node: oldNode,
                patchType: "element"
            }
        ];
    }
    else {
        //都是文本节点的情况下，直接修改内容
        if (oldType == 'text') {
            if (oldNode.text != newNode.text) {
                return [
                    {
                        node: oldNode,
                        text: newNode.text,
                        patchType: "text"
                    }
                ];
            }
            else {
                return [];
            }
        }
        else {
            //检查tag是否相同，如果不相同，直接替换
            var patchs = [];
            if (oldNode.tagName != newNode.tagName) {
                patchs.push({
                    type: "modify",
                    targets: [newNode],
                    index: -1,
                    node: oldNode,
                    patchType: "element"
                });
            }
            else {
                //检查属性
                var newElement = newNode;
                var oldElement = oldNode;
                for (var name in newElement.attributes) {
                    if (name in oldElement.attributes) {
                        //这里包含了新增
                        if (newElement.attributes[name] !== oldElement.attributes[name]) {
                            patchs.push({
                                node: oldNode,
                                key: name,
                                value: newElement.attributes[name],
                                type: 'modify',
                                patchType: "attribute"
                            });
                        }
                    }
                    else {
                        patchs.push({
                            node: oldNode,
                            key: name,
                            value: '',
                            type: 'remove',
                            patchType: "attribute"
                        });
                    }
                }
                //检查子元素
                var len = -1;
                if (newElement.children.length > oldElement.children.length) {
                    patchs.push({
                        type: 'add',
                        node: oldElement,
                        targets: newElement.children.slice(oldElement.children.length, newElement.children.length),
                        index: -1,
                        patchType: "element"
                    });
                    len = oldElement.children.length;
                }
                else if (oldElement.children.length > newElement.children.length) {
                    patchs.push({
                        type: "remove",
                        node: oldElement,
                        targets: [],
                        index: newElement.children.length,
                        patchType: "element"
                    });
                    len = newElement.children.length;
                }
                else {
                    len = oldElement.children.length;
                }
                // console.log(len)
                for (var i = 0; i < len; i++) {
                    patchs = patchs.concat(diff(oldElement.children[i], newElement.children[i]) || []);
                }
            }
            return patchs;
        }
    }
}
exports.diff = diff;
function patch(patchs) {
    for (var _i = 0, patchs_1 = patchs; _i < patchs_1.length; _i++) {
        var patch = patchs_1[_i];
        if (patch.patchType == 'element') {
            var p = patch;
            var node = p.node;
            if (p.type == 'modify') {
                var rdom = generateRealDom(p.targets[0]);
                var sourceDom = node.dom || null;
                //覆盖所有属性
                for (var key in node) {
                    delete node[key];
                }
                for (var key in p.targets[0]) {
                    node[key] = p.targets[0][key];
                }
                //修正dom
                if (sourceDom) {
                    sourceDom.parentNode.replaceChild(sourceDom, rdom);
                }
            }
            else if (p.type == 'add') {
                for (var _a = 0, _b = p.targets; _a < _b.length; _a++) {
                    var target = _b[_a];
                    var rdom = generateRealDom(target);
                    node.children.push(target);
                    if (node.dom) {
                        node.dom.appendChild(rdom);
                    }
                }
            }
            else if (p.type == 'remove') {
                var len = node.children.length;
                var targets = node.children.slice(p.index, node.children.length);
                //删除虚拟dom
                node.children.splice(p.index, node.children.length);
                //删除真实dom
                if (node.dom) {
                    for (var i = p.index; i < len; i++) {
                        var needToDelete = node.dom.childNodes[i];
                        if (needToDelete) {
                            node.dom.removeChild(needToDelete);
                        }
                    }
                }
            }
        }
        else if (patch.patchType == 'text') {
            var p = patch;
            var node = p.node;
            node.text = p.text;
            if (node.dom) {
                node.dom.nodeValue = p.text;
            }
        }
        else if (patch.patchType == 'attribute') {
            var p = patch;
            var node = p.node;
            if (p.type == 'modify') {
                node.attributes[p.key] = p.value;
                if (node.dom) {
                    node.dom.setAttribute(p.key, p.value);
                }
            }
            else if (p.type == 'remove') {
                delete node.attributes[p.key];
                if (node.dom) {
                    node.dom.removeAttribute(p.key);
                }
            }
        }
    }
}
exports.patch = patch;
function generateRealDom(vNode) {
    var node;
    //text
    if ('text' in vNode) {
        vNode = vNode;
        node = document.createTextNode(vNode.text);
        vNode.dom = node;
        return node;
    }
    else {
        // else((<VElementNode>vNode).tagName){
        vNode = vNode;
        node = document.createElement(vNode.tagName);
        for (var name in vNode.attributes) {
            node.setAttribute(name, vNode.attributes[name]);
        }
        for (var _i = 0, _a = vNode.children; _i < _a.length; _i++) {
            var child = _a[_i];
            node.appendChild(generateRealDom(child));
        }
        vNode.dom = node;
        //双向绑定的处理
        if (vNode.duplex) {
            node.addEventListener('keyup', vNode.duplex);
            // node.addEventListener("change",vNode.duplex);
        }
        if (vNode.eventHandler) {
            for (var eventName in vNode.eventHandler) {
                node.addEventListener(eventName, vNode.eventHandler[eventName]);
            }
        }
        return node;
    }
}
exports.generateRealDom = generateRealDom;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var vdom_1 = __webpack_require__(4);
var utils_1 = __webpack_require__(1);
var ast_1 = __webpack_require__(3);
var cube_1 = __webpack_require__(0);
var Widget = (function () {
    function Widget(elem) {
        this.elem = elem;
        this.$indexCount = 0;
        this.delay = false;
        this.needToRerender = false;
        this.astTree = ast_1.generateASTTree(elem);
        if (!this.astTree) {
            //
            utils_1.log("解析抽象语法树失败");
        }
        utils_1.log(this.astTree);
        if (!this.astTree.attributes['c-tpl']) {
            utils_1.log("无法获取数据");
        }
        this.dataKey = this.astTree.attributes['c-tpl'];
        if (!cube_1.Cube.$instance.get(this.dataKey)) {
            cube_1.Cube.$instance.set(this.dataKey, {});
        }
        this.ignoreAttributes = [
            'data',
            'value'
        ];
        //初次渲染
    }
    Widget.prototype.render = function () {
        utils_1.log("重新渲染中");
        var vdom = this.renderVirtualDom();
        this.renderDom(vdom);
    };
    /**
     * 渲染函数
     * @param vdom
     */
    Widget.prototype.renderDom = function (vdom) {
        //初次渲染，整体生成dom
        if (!this.vdom) {
            var rDom = vdom_1.generateRealDom(vdom);
            this.vdom = vdom;
            if (this.elem.parentNode) {
                this.elem.parentNode.replaceChild(rDom, this.elem);
                this.elem = rDom;
            }
        }
        else {
            var dif = vdom_1.diff(this.vdom, vdom);
            vdom_1.patch(dif);
            console.warn("diff is", dif);
            // var rDom = generateRealDom(vdom);
            // this.vdom = vdom; 
            // if(this.elem.parentNode){
            //     this.elem.parentNode.replaceChild(rDom,this.elem);
            //     this.elem = rDom;
            // }
        }
        // log("start to render");
        // return render(this.vdom,<any>window[this.dataKey]);
    };
    /**
     * 渲染虚拟dom，进行diff操作后，patch回dom树
     */
    Widget.prototype.renderVirtualDom = function () {
        this.$indexCount = 0;
        var data = cube_1.Cube.$instance.get(this.dataKey);
        var vdom = this.walk(this.astTree, [data]);
        utils_1.log('vdom is', vdom);
        utils_1.log('ast is', JSON.stringify(this.astTree));
        return vdom[0];
    };
    Widget.prototype.walk = function (ast, contextStack) {
        var _this = this;
        var vdomNode;
        // var _this = this;
        var factory;
        switch (ast.type) {
            //指令
            case 'object':
                //循环指令，改变上下文环境
                if (ast.expInfo.obj) {
                    factory = ast.factory || (function () {
                        var expression = ast.expInfo;
                        var _a = _this.generateContextCode(contextStack), codeBufferHead = _a[0], codeBufferTail = _a[1];
                        var code = "\n                            var _this = this;\n                            var _result = [];\n                            " + codeBufferHead.join(" ") + "\n                            var each = function(obj,callback){\n                                if(Array.isArray(obj)){\n                                    for(var i = 0; i < obj.length; i++){\n                                        callback.call(_this,i,obj[i]);   \n                                    }\n                                }\n                                else{\n                                    for(var i in obj){\n                                        callback.call(_this,i,obj[i]);\n                                    }\n                                }\n                            };\n                            each(" + expression.obj + ",function(" + expression.key + "," + expression.value + "){\n                                var newContextStack = contextStack.concat();\n                                newContextStack.push({\n                                    " + expression.value + " : " + expression.value + ",\n                                    " + expression.key + " : " + expression.key + " \n                                });\n                                ast.children.forEach(function(astNode){\n                                    _result = _result.concat(_this.walk(astNode,newContextStack));\n                                });\n                            });\n                            " + codeBufferTail.join(" ") + ";\n                            return _result;\n                        ";
                        return new Function('ast', 'contextStack', code);
                    })();
                    return factory.call(this, ast, contextStack);
                }
                else if (ast.expInfo.ifs) {
                    factory = ast.factory || (function () {
                        var expression = ast.expInfo;
                        var _a = _this.generateContextCode(contextStack), codeBufferHead = _a[0], codeBufferTail = _a[1];
                        var code = "\n                            var _this = this;\n                            var _result = [];\n                            " + codeBufferHead.join(" ") + "\n                            " + (function () {
                            var _code = [];
                            expression.ifs.forEach(function (ife, key) {
                                if (key == 0) {
                                    _code.push("if(" + ife.condition + "){");
                                }
                                else {
                                    _code.push("else if(" + ife.condition + "){");
                                }
                                _code.push("\n                                            ast.expInfo.ifs[" + key + "].nodes.forEach(function(astNode){\n                                                _result = _result.concat(_this.walk(astNode,contextStack));\n                                            }); \n                                        ");
                                _code.push("}");
                            });
                            if (expression.els != null) {
                                _code.push("else{");
                                _code.push("\n                                            ast.expInfo.els.forEach(function(astNode){\n                                             _result = _result.concat(_this.walk(astNode,contextStack));\n                                            }); \n                                        ");
                                _code.push("}");
                            }
                            return _code.join(" ");
                        })() + "\n        \n                            " + codeBufferTail.join(" ") + ";\n                            return _result;\n                        ";
                        return new Function('ast', 'contextStack', code);
                    })();
                    return factory.call(this, ast, contextStack);
                }
                break;
            //普通表达式
            case 'expression':
                return [{
                        text: this.renderText(ast, contextStack)
                    }];
            //普通文本
            case 'text':
                vdomNode = {
                    text: ast.value
                };
                return [vdomNode];
            //元素
            case 'element':
                vdomNode = {
                    children: [],
                    attributes: {},
                    tagName: ast.tagName,
                    duplex: undefined
                };
                //渲染子节点
                for (var i = 0; i < ast.children.length; i++) {
                    var ret = this.walk(ast.children[i], contextStack);
                    vdomNode.children = vdomNode.children.concat(ret);
                }
                //渲染属性
                //如果存在双向绑定的节点
                if (ast.tagName == 'INPUT' && ast.attributes[':value']) {
                    if (ast.attributes.type == 'radio') {
                    }
                    else if (ast.attributes.type == 'checkbox') {
                    }
                    else {
                        console.log("该元素被双向绑定");
                        factory = ast.factory || (function () {
                            var _a = _this.generateContextCode(contextStack), head = _a[0], tail = _a[1];
                            var code = "\n                                     return function(e){\n                                         " + head.join(" ") + "\n                                         var target = e.target;\n                                         " + ast.attributes[":value"] + " = target.value;\n                                         " + tail.join(" ") + "\n                                     }\n                                 ";
                            var f = new Function('contextStack', code);
                            return f.call(_this, contextStack);
                        })();
                        vdomNode.duplex = factory;
                    }
                }
                for (var name in ast.attributes) {
                    if (name[0] == ':') {
                        var ename = name.substr(1);
                        //事件处理器
                        if (this.ignoreAttributes.indexOf(ename) === -1) {
                            vdomNode.eventHandler = vdomNode.eventHandler || {};
                            if (ast.eventHandler && ast.eventHandler[ename]) {
                                vdomNode.eventHandler[ename] = ast.eventHandler[ename];
                            }
                            else {
                                ast.eventHandler = ast.eventHandler || {};
                                vdomNode.eventHandler[ename] = ast.eventHandler[ename] || (function () {
                                    var _a = _this.generateContextCode(contextStack), head = _a[0], tail = _a[1];
                                    var code = "\n                                             return function(e){\n                                                 " + head.join(" ") + "\n                                                 return (" + ast.attributes[name] + ");\n                                                 " + tail.join(" ") + "\n                                             }\n                                         ";
                                    var f = new Function('contextStack', code);
                                    return f.call(_this, contextStack);
                                })();
                            }
                            delete ast.attributes[name];
                            continue;
                        }
                    }
                    vdomNode.attributes[name] = ast.attributes[name].replace(/~([\s\S]+?)~/g, function (a, b) {
                        return _this.renderText(ast, contextStack, b);
                    });
                    //清除为空的节点
                    if (vdomNode.attributes[name] == '') {
                        delete vdomNode.attributes[name];
                    }
                }
                if (ast.attributes[':value']) {
                    vdomNode.attributes.value = this.renderText(ast, contextStack, ast.attributes[':value']);
                }
                return [vdomNode];
        }
        return [];
    };
    /**
     * 生成代码的作用域
     * @param contextStack
     */
    Widget.prototype.generateContextCode = function (contextStack) {
        var codeBufferHead = ['try{'], codeBufferTail = [];
        contextStack.forEach(function (context, contextKey) {
            codeBufferHead.push('with(contextStack[' + contextKey + ']){');
            codeBufferTail.push('}');
        });
        codeBufferTail.push("}catch(e){ console.error(e) }");
        return [codeBufferHead, codeBufferTail];
    };
    Widget.prototype.renderText = function (ast, contextStack, value) {
        var _this = this;
        var factory = ast.factory || (function () {
            var _a = _this.generateContextCode(contextStack), codeBufferHead = _a[0], codeBufferTail = _a[1];
            var code = "\n                var _result;\n                " + codeBufferHead.join(" ") + " \n                _result = " + (value || ast.value) + ";\n                " + codeBufferTail.join(" ") + "\n                return _result;\n            ";
            return new Function('ast', 'contextStack', code);
        })();
        var val = factory.call(this, ast, contextStack);
        return val || '';
    };
    return Widget;
}());
exports.Widget = Widget;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

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

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var cube_1 = __webpack_require__(0);
__webpack_require__(2);
var cube = cube_1.Cube.$instance = new cube_1.Cube;
window.Cube = cube;
cube.start();


/***/ })
/******/ ]);