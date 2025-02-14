import { _decorator, Component, Node } from 'cc';
import { BaseBuff, BuffAttribute, TickingBuff } from '../base/BaseBuff';
const { ccclass, property } = _decorator;

@ccclass('MoveSlowBuff')
export class MoveSlowBuff extends TickingBuff {
    /**
     * 移动速度减 0.5
     */
    value:number = 0.5;
    /**
     * 持续时间 5s
     */
    duration:number = 5;

    start() {

    }

    // tick(deltaTime: number) {
    //     super.tick(deltaTime);
    // }

    work(data:BuffAttribute) {
        data.move *= this.value;
    }

    unwork(data:BuffAttribute) {
        data.move /= this.value;
    }
}


