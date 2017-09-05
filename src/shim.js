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