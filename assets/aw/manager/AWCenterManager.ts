import { _decorator, assert, AudioClip, AudioSource, BlockInputEvents, color, Component, director, EventTouch, log, math, Node, Pool, RenderRoot2D, Sprite, SpriteFrame, UITransform, Widget } from 'cc';

import { FWManager } from '../../framework/manager/FWManager';
import { FWBaseManager } from '../../framework/manager/FWBaseManager';
import { Center } from '../center/center';

const { ccclass, property } = _decorator;

@ccclass('AWCenterManager')
export class AWCenterManager extends FWBaseManager {
    private _center:Center = new Center();
    
    __preload() {
        this._center.initCenter();
    }

    start(): void {
        this._center.start();
    }

    update(deltaTime: number): void {
        this._center.update(deltaTime);
    }

    dectroy(): void {
        super.dectroy();
        this._center.dectroy();
    }

    onDestroy() {
    }
}

FWManager.register("center",()=>new AWCenterManager())


declare global {
    namespace globalThis {
        interface IFWManager {
            center : AWCenterManager
        }
    }
}