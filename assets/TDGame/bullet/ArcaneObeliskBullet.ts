import { _decorator, Component, Node } from 'cc';
import { Monster } from '../monster/Monster';
import { GameManager } from '../manager/GameManager';
import { MoveSlowBuff } from '../buff/MoveSlowBuff';
import { BulletNode } from '../base/BulletNode';
import { TDObject } from '../base/TDObject';
const { ccclass, property } = _decorator;

@ccclass('ArcaneObeliskBullet')
export class ArcaneObeliskBullet extends BulletNode {

    takeDamage(obj:Monster, originObj:TDObject) {
        if ( !super.takeDamage(obj,originObj) ) return false;
        GameManager.instance.removeObj(this.node);
        if ( obj && obj.isValid) {
            // 添加buff
            this._addBuff(obj);
            obj.takeDamage(this.damage,originObj);
        }
        return true;
    }
    
    // 检测并添加减速buff
    _addBuff(obj:Monster) {
        let buff = obj.getBuff(MoveSlowBuff,this.originObj);
        if (buff == null) {
            buff = new MoveSlowBuff();
            buff.originObj = this.originObj;
            obj.addBuff(buff);
        }
        buff.resetCountdown();
    }
}


