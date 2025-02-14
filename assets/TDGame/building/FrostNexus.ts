import { _decorator, Component, Node } from 'cc';
import { BuildNode } from '../base/BuildNode';
import { Monster } from '../monster/Monster';
import { MoveSlowBuff } from '../buff/MoveSlowBuff';
const { ccclass, property } = _decorator;

@ccclass('FrostNexus')
export class FrostNexus extends BuildNode {
    tick(deltaTime: number) {
        super.tick(deltaTime);
        this.monsterList.forEach(v=>{
            this.checkAndAddBuff(v);
        })
    }
    
    // 检测并添加减速buff
    checkAndAddBuff(obj:Monster) {
        let buff = obj.getBuff(MoveSlowBuff)
        if (buff == null) {
            buff = new MoveSlowBuff();
            buff.originObj = this;
            obj.addBuff(buff);
        }
        buff.resetCountdown();
    }
}


