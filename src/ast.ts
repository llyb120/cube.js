import { ASTNode } from './ast';
import { isSpace, clone } from './utils';
const reg = /~([\s\S]+?)~/g;
const space = "[\\s\\n\\r\\t]*";
const notSpace = "[^\\s\\n\\r\\t]+";
const word = "[\\w]+";
export const ifReg = /^if(.+)$/;
const elseifReg = new RegExp(`^else${space}if(.+)$`);
const elseReg = /^else(.*)$/;
export const forReg = new RegExp(`^(?:for|each)${space}(${word})${space}(?:,${space}(${word})${space})?in${space}(${notSpace})$`);
const endReg = /^end$/;
///^(?:for|each)[\s\n\r\t]*([\w]+)[\s\n\r\t]*,[\s\n\r\t]*([\w]+)[\s\n\r\t]*in[\s\n\r\t]*([^\s\n\r\t]+)/;

export interface ASTNode {
    children: ASTNode[],
    type: 'text' | 'expression' | 'element' | 'object';
    value?: string;
    expInfo?: ForExpression | IfExpression;
    attributes?: any,
    factory? : Function,
    tagName? : string;
}

export interface ForExpression {
    key?: string,
    value: string;
    obj: string;
}
export interface IfExpression {
    ifs : [
        {
            condition : string,
            nodes : ASTNode[]
        }
    ]
    els : ASTNode[] | null
    
}

// export interface Expression{
//     expression : ForExpression | IfExpression,
//     objects : ASTNode[]
// }


/**
 * 生成抽象语法树
 * @param domNode 
 * @param parentNode 
 */
export function generateASTTree(domNode: HTMLElement, parentNode?: ASTNode): ASTNode | ASTNode[] {
    var nodes;
    //元素节点
    if (domNode.nodeType == 1) {
        var thisNode: ASTNode = {
            type: 'element',
            children: [],
            attributes: {},
            tagName : domNode.tagName
        }
        //遍历所有子元素
        for (var i = 0; i < domNode.childNodes.length; i++) {
            nodes = generateASTTree(<HTMLElement>domNode.childNodes[i], thisNode);
            thisNode.children = thisNode.children.concat(nodes);
        }
        //遍历所有属性节点
        for (var i = 0; i < domNode.attributes.length; i++) {
            var attrNode = domNode.attributes[i];
            thisNode.attributes[attrNode.nodeName] = attrNode.nodeValue;
        }
        console.log(clone(thisNode.children));
        //规约子节点
        var stack: (ASTNode | null)[] = [];
        var values: (ForExpression | IfExpression)[] = [];
        for (var i = 0; i < thisNode.children.length; i++) {
            var item = thisNode.children[i];
            if (item.type != 'expression') {
                stack.push(item);
                continue;
            }
            var matched;
            if (matched = (item.value as string).match(ifReg)) {
                stack.push(null);
                values.push({
                    ifs : [
                        {
                            condition : matched[1],
                            nodes : []
                        }
                    ],
                    els : null
                });
            }
            else if (matched = (item.value as string).match(forReg)) {
                stack.push(null);
                var exp: ForExpression = {
                    key: matched[2] ? matched[1] : undefined,
                    value: matched[2] ? matched[2] : matched[1],
                    obj: matched[3]
                };
                values.push(exp);
            }
            else if(matched = (item.value as string).match(elseifReg) || (item.value as string).match(elseReg)){
                var index = stack.lastIndexOf(null);
                if (index == -1) {
                    throw new Error('匹配不到对应的元素');
                } 
                //补充上一个if元素的节点
                var targets = stack.slice(index + 1,stack.length);
                stack.splice(index + 1,stack.length);
                var top = values[values.length - 1] as IfExpression;
                var ifs = (top as IfExpression).ifs;
                ifs[ifs.length - 1].nodes = <ASTNode[]>targets;
                //开辟下一个elseif
                //如果没有匹配到表达式，那么表示这是一个else
                if(matched[1].trim() == ''){
                    top.els = []
                }
                //正常的elseif
                else{
                    ifs.push({
                        condition : matched[1],
                        nodes : []
                    });
                }
               
            }
            // else if(matched = (item.value as string).match(elseReg)){
            //     var index = stack.lastIndexOf(null);
            //     if (index == -1) {
            //         throw new Error('匹配不到对应的元素');
            //     }  
            // }
            else if (endReg.test(item.value as string)) {
                var index = stack.lastIndexOf(null);
                if (index == -1) {
                    throw new Error('匹配不到对应的元素');
                }
                var targets = stack.slice(index + 1,stack.length);
                var value = values.pop() as IfExpression;
                //如果是逻辑表达式
                //1.当els为Null的时候，将node补充到ifs的栈顶
                //2.当els存在的时候，node补充到els
                if(value.ifs){
                    if(value.els){
                        value.els = <ASTNode[]>targets;
                    }
                    else{
                        value.ifs[value.ifs.length - 1].nodes = <ASTNode[]>targets;
                    }
                }
                stack.splice(index,stack.length);
                stack.push(<ASTNode>{
                    type: 'object',
                    value: '',//item.value,
                    expInfo: value,
                    children : targets
                })
            }
            //普通表达式
            else{
                stack.push(item);
            }
        }
        thisNode.children = <ASTNode[]>stack;
        return thisNode;
    }
    //文本节点
    else if (domNode.nodeType == 3) {
        if (isSpace(domNode.nodeValue as string)) {
            return [];
        }
        //拆分节点
        nodes = splitTextNode((domNode.nodeValue as string).trim());
        return nodes;
    }
    return [];
}

/**
 * 解析文本节点并生成语法树节点
 * @param value 
 */
function splitTextNode(value: string): ASTNode[] {
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
    var ret: ASTNode[] = [];
    var strarr = [];
    var in_scope = false;
    for (var i = 0; i < value.length; i++) {
        var char = value[i];
        if (char == '~') {
            var text,
                isSpecial = false;
            if (in_scope) {
                text = (value.substring(start + 1, i)).trim();
                start = i + 1;
                isSpecial = true;
            }
            //text
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