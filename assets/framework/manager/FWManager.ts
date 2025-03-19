import { assert, instantiate, sys } from "cc";
import { manager } from "../common/FWShare";
import { FWBaseManager } from "./FWBaseManager";
import { FWUIManager } from "./FWUIManager";
import { FWAssetManager } from "./FWAssetManager";
import { FWNativeAndroid, FWNativeBrowser, FWNativeIOS, FWNativeWindows } from "../native/FWNative";
import { FWSceneManager } from "./FWSceneManager";
import { FWAudioManager } from "./FWAudioManager";

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


FWManager.register("asset",()=>new FWAssetManager())
FWManager.register("scene",()=>new FWSceneManager())
FWManager.register("audio",()=>new FWAudioManager())
FWManager.register("ui",() => new FWUIManager())
FWManager.register("native",() => {
    if (sys.isBrowser) return new FWNativeBrowser()
    if (sys.isNative) {
        if(sys.os == "Android") return new FWNativeAndroid()
        if(sys.os == "iOS") return new FWNativeIOS()
        if(sys.os == "Windows") return new FWNativeWindows();
    }
    assert(false, `not support native ${sys.os}`);
})

