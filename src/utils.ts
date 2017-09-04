
export function log(...args : any[]){
    try{
        console.log.apply(null,args);
    }catch(e){

    }
}

export function isSpace(str : string){
    return /^[\s\n\r\t]+$/.test(str) || str == "";
}


export function clone(obj : any){
    return JSON.parse(JSON.stringify(obj));
}