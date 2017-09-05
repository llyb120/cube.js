import { log } from './utils';
import { Widget } from './widget';
import domready = require('./domready');
export class Cube {
    private $data: any = {};
    public static $instance: Cube;
    private $widgets: Widget[] = [];
    private $observer: any = {};

    start() {
        domready.Ready(() => {
            var elems = document.querySelectorAll("[c-tpl]");
            for (var i = 0; i < elems.length; i++) {
                this.$widgets.push(new Widget(elems[i] as HTMLElement));
                // var vdom = scan(<HTMLElement>elems[i]);
                // log(vdom);
            }

            this.startToObserve();

        })
    }

    set(key: string, val: any) {
        this.$data[key] = val;
    }

    get(key: string) {
        return this.$data[key] || null;
    }


    startToObserve() {
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        if (!requestAnimationFrame) {
            requestAnimationFrame = (fn) => setTimeout(fn, 17);
        }

        var start: any = null;
        var timelimit = 0;
        var step = (timestamp: any) => {
            if (start === null) start = timestamp;
            var progress = timestamp - start;
            timelimit += 17;
            if (timelimit > 50) {
                timelimit = 0;
                this.$widgets.forEach(widget => {
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
                    var json = JSON.stringify(this.$data[key]);
                    //当脏检测触发的时候，推迟到下一个时间点进行渲染，降低单一渲染的压力
                    if (json != this.$observer[key]) {
                        widget.needToRerender = true;
                        widget.delay = true;
                        this.$observer[key] = json;
                    }
                });
            }
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step)
    }

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