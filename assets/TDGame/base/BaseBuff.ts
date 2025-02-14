import { _decorator, Component, Node } from 'cc';
import { TDObject, TDObjectBuff } from './TDObject';
const { ccclass, property } = _decorator;

export class BaseBuff {
    originObj:TDObject;
    targetObj:TDObjectBuff;

    tick(deltaTime: number) {
    }
    
    work(data:BuffAttribute) {
    }

    unwork(data:BuffAttribute) {
    }
}

export class ForeverBuff extends BaseBuff {

}

export class TickingBuff extends BaseBuff {
    /**
     * 持续时间（s）
     */
    @property
    duration:number = 500;
    _countdown:number = 0;

    resetCountdown() {
        this._countdown = this.duration;
    }

    tick(deltaTime: number) {
        super.tick(deltaTime);
        this._countdown = Math.max(0,this._countdown - deltaTime);
        if( this._countdown == 0) {
            this.targetObj.delBuff(this);
        }
    }
}

export class BuffAttribute {
    /**
     * 移动加速百分比 默认值1
     */
    move:number;
    constructor() {
        this.reset();
    }
    reset() {
        this.move = 1;
    }
}