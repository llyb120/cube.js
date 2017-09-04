import { VDomNode, generateRealDom, diff, patch } from './vdom';
import { log } from './utils';
import { ASTNode, generateASTTree, ForExpression, IfExpression } from './ast';
import { Cube } from './cube';

export class Widget {
    public vdom: VDomNode;
    public dataKey: string;
    public astTree: ASTNode;
    private $indexCount = 0;
    public delay = false;
    public needToRerender = false;

    constructor(public elem: Node) {
        this.astTree = <ASTNode>generateASTTree(<HTMLElement>elem);
        if (!this.astTree) {
            //
            log("解析抽象语法树失败");
        }
        log(this.astTree);
        if (!this.astTree.attributes['c-tpl']) {
            log("无法获取数据");
        }
        this.dataKey = this.astTree.attributes['c-tpl'];

        //初次渲染
        
    }

    render(){
        log("重新渲染中");
        var vdom = this.renderVirtualDom();
        this.renderDom(vdom);
    }

    /**
     * 渲染函数
     * @param vdom 
     */
    renderDom(vdom : VDomNode) {
        //初次渲染，整体生成dom
        if(!this.vdom){
            var rDom = generateRealDom(vdom);
            this.vdom = vdom;
            if(this.elem.parentNode){
                this.elem.parentNode.replaceChild(rDom,this.elem);
                this.elem = rDom;
            }
        }
        else{
            var dif = diff(this.vdom,vdom);
            patch(dif);
            console.warn("diff is",dif);
            // var rDom = generateRealDom(vdom);
            // this.vdom = vdom; 
            // if(this.elem.parentNode){
            //     this.elem.parentNode.replaceChild(rDom,this.elem);
            //     this.elem = rDom;
            // }
        }

        // log("start to render");
        // return render(this.vdom,<any>window[this.dataKey]);
    }

    /**
     * 渲染虚拟dom，进行diff操作后，patch回dom树
     */
    renderVirtualDom() {
        this.$indexCount = 0;
        var data = Cube.$instance.get(this.dataKey);
        var vdom = this.walk(this.astTree, [data]);
        log('vdom is', vdom);
        log('ast is', JSON.stringify(this.astTree));
        return vdom[0];
    }

    walk(ast: ASTNode, contextStack: any[]): VDomNode[] {
        var vdomNode: VDomNode;
        // var _this = this;
        var factory;
        switch (ast.type) {
            //指令
            case 'object':
                //循环指令，改变上下文环境
                if (<ForExpression>(<any>ast.expInfo).obj) {
                    factory = ast.factory || (() => {
                        let expression = <ForExpression>(<any>ast.expInfo);
                        expression.key = expression.key || '$index' + this.$indexCount;
                        var codeBufferHead: string[] = ['try{'],
                            codeBufferTail: string[] = [];
                        contextStack.forEach((context, contextKey) => {
                            codeBufferHead.push('with(contextStack[' + contextKey + ']){');
                            codeBufferTail.push('}');
                        });
                        codeBufferTail.push("}catch(e){ console.error(e) }");
                        var code = `
                            var _this = this;
                            var _result = [];
                            ${codeBufferHead.join(" ")}
                            var each = function(obj,callback){
                                if(Array.isArray(obj)){
                                    for(var i = 0; i < obj.length; i++){
                                        callback.call(_this,i,obj[i]);   
                                    }
                                }
                                else{
                                    for(var i in obj){
                                        callback.call(_this,i,obj[i]);
                                    }
                                }
                            };
                            each(${expression.obj},function(${expression.key},${expression.value}){
                                var newContextStack = contextStack.concat();
                                newContextStack.push({
                                    ${expression.value} : ${expression.value},
                                    ${expression.key} : ${expression.key} 
                                });
                                ast.children.forEach(function(astNode){
                                    _result = _result.concat(_this.walk(astNode,newContextStack));
                                });
                            });
                            ${codeBufferTail.join(" ")};
                            return _result;
                        `;
                        return new Function('ast', 'contextStack', code);
                    })();
                    return factory.call(this, ast, contextStack);
                }
                //逻辑指令，不改变上下文环境
                else if ((ast.expInfo as IfExpression).ifs) {
                    factory = ast.factory || (() => {
                        let expression = <IfExpression>(<any>ast.expInfo);
                        var codeBufferHead: string[] = ['try{'],
                            codeBufferTail: string[] = [];
                        contextStack.forEach((context, contextKey) => {
                            codeBufferHead.push('with(contextStack[' + contextKey + ']){');
                            codeBufferTail.push('}');
                        });
                        codeBufferTail.push("}catch(e){ console.error(e) }");
                        var code = `
                            var _this = this;
                            var _result = [];
                            ${codeBufferHead.join(" ")}
                            ${
                                (() => {
                                    let _code : string[] = [];
                                    expression.ifs.forEach((ife,key) => {
                                        if(key == 0){
                                            _code.push(`if(${ife.condition}){`);
                                        }
                                        else{
                                            _code.push(`else if(${ife.condition}){`)
                                        }
                                        _code.push(`
                                            ast.expInfo.ifs[${key}].nodes.forEach(function(astNode){
                                                _result = _result.concat(_this.walk(astNode,contextStack));
                                            }); 
                                        `);
                                        _code.push("}");
                                    });
                                    if(expression.els != null){
                                        _code.push("else{");
                                        _code.push(`
                                            ast.expInfo.els.forEach(function(astNode){
                                             _result = _result.concat(_this.walk(astNode,contextStack));
                                            }); 
                                        `);
                                        _code.push("}");
                                    }
                                    return _code.join(" ");
                                })()
                            }
        
                            ${codeBufferTail.join(" ")};
                            return _result;
                        `;
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
                    text: ast.value as string
                }
                return [vdomNode];

            //元素
            case 'element':
                vdomNode = {
                    children: [],
                    attributes: {},
                    tagName : ast.tagName as string
                };
                //渲染子节点
                for (var i = 0; i < ast.children.length; i++) {
                    var ret = this.walk(ast.children[i], contextStack);
                    vdomNode.children = vdomNode.children.concat(ret);
                }
                //渲染属性
                for (var name in ast.attributes) {
                    vdomNode.attributes[name] = ast.attributes[name].replace(/~([\s\S]+?)~/g, (a: string, b: string) => {
                        return this.renderText(ast, contextStack);
                    });
                }
                return [vdomNode];
        }
        return [];
    }

    renderText(ast: ASTNode, contextStack: any[]) {
        var factory = ast.factory || (() => {
            var codeBufferHead: string[] = ['try{'],
                codeBufferTail: string[] = [];
            contextStack.forEach((context, contextKey) => {
                codeBufferHead.push('with(contextStack[' + contextKey + ']){');
                codeBufferTail.push('}');
            });
            codeBufferTail.push("}catch(e){ console.error(e) }");
            var code = `
                var _result;
                ${codeBufferHead.join(" ")} 
                _result = ${ast.value};
                ${codeBufferTail.join(" ")}
                return _result;
            `;
            return new Function('ast', 'contextStack', code);
        })();
        var val = factory.call(this, ast, contextStack);
        return val || '';
    }


}