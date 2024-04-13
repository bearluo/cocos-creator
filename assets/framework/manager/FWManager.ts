import { assert, instantiate } from "cc";
import { manager } from "../common/FWShare";
import { FWBaseManager } from "./FWBaseManager";

/**
 * 
 * 添加新的manager
FWManager.register("xxx",new FWSceneManager())
declare global {
    namespace globalThis {
        interface IFWManager {
            xxx : FWSceneManager
        }
    }
}
 */

type FWBaseManagerCtor = ()=>FWBaseManager;
export class FWManager extends EventTarget {
    private static mapCtor:Map<string,FWBaseManagerCtor> = new Map();
    static register(key:string,ctor:FWBaseManagerCtor) {
        assert(!FWManager.mapCtor.has(key),`${key} is already registered`)
        FWManager.mapCtor.set(key,ctor);
    }

    initManager() {
        FWManager.mapCtor.forEach((element,key) => {
            this[key] = element();
        });
    }
    
    __preload() {
        manager.forEach(element => {
            element.__preload();
        });
    }

    start() {
        manager.forEach(element => {
            element.start();
        });
    }

    update(deltaTime: number): void {
        manager.forEach(element => {
            element.update(deltaTime);
        });
    }

    dectroy() {
        let old = Array.from(manager);
        manager.length = 0;
        old.forEach(element => {
            element.dectroy();
        });
    }
}

