import { _decorator, assert, AudioClip, AudioSource, BlockInputEvents, color, Component, director, EventTouch, log, Node, Pool, RenderRoot2D, Sprite, SpriteFrame, sys, UITransform, Widget } from 'cc'
import { FWNative, FWNativeAndroid, FWNativeBrowser, FWNativeIOS, FWNativeWindows } from '../native/FWNative';
const { ccclass, property } = _decorator;



declare global {
    namespace globalThis {
        interface IFWNative {
        }
        interface IFWManager {
            native : IFWNative & FWNative
        }
    }
}