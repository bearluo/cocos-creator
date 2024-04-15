import { _decorator, assert, AudioClip, AudioSource, BlockInputEvents, color, Component, director, EventTouch, log, Node, Pool, RenderRoot2D, Sprite, SpriteFrame, sys, UITransform, Widget } from 'cc'
import { FWManager } from './FWManager';
import { FWNative, FWNativeAndroid, FWNativeBrowser, FWNativeIOS, FWNativeWindows } from '../native/FWNative';
const { ccclass, property } = _decorator;

FWManager.register("native",() => {
    if (sys.isBrowser) return new FWNativeBrowser()
    if (sys.isNative) {
        if(sys.os == "Android") return new FWNativeAndroid()
        if(sys.os == "iOS") return new FWNativeIOS()
        if(sys.os == "Windows") return new FWNativeWindows();
    }
    assert(false, `not support native ${sys.os}`);
})

declare global {
    namespace globalThis {
        interface IFWNative {
        }
        interface IFWManager {
            native : IFWNative & FWNative
        }
    }
}