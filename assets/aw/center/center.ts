import { assert, instantiate, ISchedulable, System } from "cc";
import { BindInetMsg } from "../network/BindInetMsg";
import { FWTimer } from "../../framework/common/FWTimer";

export const centerInstantiate:CenterBase[] = []

type CenterCtor = ()=>CenterBase;

export class Center {
    private static mapCtor:Map<string,CenterCtor> = new Map();
    static register(key:string,ctor:CenterCtor) {
        assert(!Center.mapCtor.has(key),`${key} is already registered`)
        Center.mapCtor.set(key,ctor);
    }
    constructor() {
        globalThis.center = this;
    }

    initCenter() {
        Center.mapCtor.forEach((element,key) => {
            this[key] = element();
        });
    }

    __preload() {
        centerInstantiate.forEach(element => {
            element.__preload();
        });
    }

    start() {
        centerInstantiate.forEach(element => {
            element.start();
        });
    }
    
    update(deltaTime: number) {
        centerInstantiate.forEach(element => {
            element.update(deltaTime);
        });
    }
    
    dectroy() {
        let old = Array.from(centerInstantiate);
        centerInstantiate.length = 0;
        old.forEach(element => {
            element.dectroy();
        });
        globalThis.center = null;
    }
}

export class CenterBase {
    constructor() {
        centerInstantiate.push(this);
    }

    __preload() {
    }

    start() {

    }

    update(deltaTime: number) {
    }

    dectroy(): void {
        let index = centerInstantiate.indexOf(this);
        if (index != -1) {
            centerInstantiate.splice(index, 1);
        }
        this.onDestroy();
    }

    onDestroy() {
        
    }
}
/**
 * 有网络协议的中心模块
 */
export class CenterInet<T extends BindInetMsg> extends CenterBase {
    inet:T;
    constructor(inet:T) {
        super();
        this.inet = inet;
        this.initRegister(this.inet,this.inet.cmd)
    }
    
    initRegister(inet:T,cmd) {

    }
}

declare global {
    namespace globalThis {
        var center: IAWCenter & Center
        interface IAWCenter {}
    }
}
