import { VElementNode, VDomNode, VTextPatch,  VAttributePatch } from './vdom';
import { log, isSpace } from './utils';

// export interface VDomNode{
//     children : VDomNode[];
//     tagName? : string;
//     type : 'element' | 'text';
//     attributes
// }

export interface VTextNode {
    text: string;
    dom?: Node;
}

export interface VElementNode {
    children: VDomNode[],
    attributes: any;
    tagName: string;
    dom?: Node;
    duplex? : Function;
    eventHandler? : {
        [key : string] : Function
    }
}

export type VDomNode = VTextNode | VElementNode

export interface VTextPatch {
    node: VDomNode,
    text: string;
    patchType: 'text' | 'element' | 'attribute';
}
export interface VElementPatch {
    node: VDomNode,
    type: "add" | "remove" | 'modify'
    index: number;
    targets: VDomNode[];
    patchType: 'text' | 'element' | 'attribute';
}
export interface VAttributePatch {
    node: VDomNode,
    type: "add" | "remove" | "modify";
    key: string;
    value: string;
    patchType: 'text' | 'element' | 'attribute';
}

export type VDomPatch = VTextPatch | VElementPatch | VAttributePatch;

export function diff(oldNode: VDomNode, newNode: VDomNode): VDomPatch[] {
    var oldType = ('text' in oldNode) ? 'text' : 'element',
        newType = ('text' in newNode) ? 'text' : 'element';

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
    //相同则进行比较
    else {
        //都是文本节点的情况下，直接修改内容
        if (oldType == 'text') {
            if ((oldNode as VTextNode).text != (newNode as VTextNode).text) {
                return [
                    {
                        node: oldNode,
                        text: (<VTextNode>newNode).text,
                        patchType: "text"
                    }
                ]
            }
            else{
                return [];
            }
        }
        //元素节点
        else {
            //检查tag是否相同，如果不相同，直接替换
            var patchs: VDomPatch[] = [];
            if ((oldNode as VElementNode).tagName != (newNode as VElementNode).tagName) {
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
                var newElement = (newNode as VElementNode)
                var oldElement = (oldNode as VElementNode);
                for (var name in newElement.attributes) {
                    if (name in oldElement.attributes) {
                        //这里包含了新增
                        if (newElement.attributes[name] !== oldElement.attributes[name]) {
                            patchs.push(<VAttributePatch>{
                                node: oldNode,
                                key: name,
                                value: newElement.attributes[name],
                                type: 'modify',
                                patchType: "attribute"
                            })
                        }
                    }
                    else {
                        patchs.push(<VAttributePatch>{
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
                //如果没有新元素，说明这个位置的元素被删除了
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

export function patch(patchs : VDomPatch[]){
    for(var patch of patchs){
        if(patch.patchType == 'element'){
            let p = <VElementPatch>patch;
            let node = p.node as VElementNode;
            if(p.type == 'modify'){
                var rdom = generateRealDom(p.targets[0]);
                var sourceDom = node.dom || null;
                //覆盖所有属性
                for(let key in node){
                    delete node[key];
                }
                for(let key in p.targets[0]){
                    node[key] = p.targets[0][key];
                }
                //修正dom
                if(sourceDom){
                    (sourceDom.parentNode as HTMLElement).replaceChild(sourceDom,rdom);
                }
            }
            else if(p.type == 'add'){
                for(var target of p.targets){
                    var rdom = generateRealDom(target);
                    node.children.push(target);
                    if(node.dom){
                        node.dom.appendChild(rdom);
                    }
                }
            }
            else if(p.type == 'remove'){
                var len = node.children.length;
                var targets = node.children.slice(p.index,node.children.length);
                //删除虚拟dom
                node.children.splice(p.index,node.children.length);
                //删除真实dom
                if(node.dom){
                    for(var i = p.index; i < len; i++){
                        var needToDelete = node.dom.childNodes[i];
                        if(needToDelete){
                            node.dom.removeChild(needToDelete);
                        }
                    }
                }
            }
        }
        else if(patch.patchType == 'text'){
            let p = <VTextPatch>patch;
            let node = p.node as VTextNode;
            node.text = p.text;
            if(node.dom){
                node.dom.nodeValue = p.text;
            }
        }
        else if(patch.patchType == 'attribute'){
            let p = <VAttributePatch>patch;
            let node = p.node as VElementNode;
            if(p.type == 'modify'){
                node.attributes[p.key] = p.value;
                var dom = node.dom as HTMLElement;
                if(node.dom){
                    if(dom.tagName == 'INPUT' && p.key == 'value'){
                        dom.value = p.value;
                    }
                    else{
                        (node.dom as HTMLElement).setAttribute(p.key,p.value);
                    }
                }
            }
            else if(p.type == 'remove'){
                delete node.attributes[p.key];
                if(node.dom){
                    (node.dom as HTMLElement).removeAttribute(p.key);
                }
            }
        }
    }
}

export function generateRealDom(vNode: VDomNode): Node {
    var node;
    //text
    if ('text' in (<VTextNode>vNode)) {
        vNode = <VTextNode>vNode;
        node = document.createTextNode(vNode.text);
        vNode.dom = node;
        return node;
    }
    else {
        // else((<VElementNode>vNode).tagName){
        vNode = <VElementNode>vNode;
        node = document.createElement(vNode.tagName);
        for (var name in vNode.attributes) {
            node.setAttribute(name, vNode.attributes[name]);
        }
        for (var child of vNode.children) {
            node.appendChild(generateRealDom(child));
        }
        vNode.dom = node;
        //双向绑定的处理
        if(vNode.duplex){
            node.addEventListener('input',vNode.duplex);
            // node.addEventListener("change",vNode.duplex);
        }
        if(vNode.eventHandler){
            for(var eventName in vNode.eventHandler){
                node.addEventListener(eventName,vNode.eventHandler[eventName]);
            }
        }
        return node;
    }
}
