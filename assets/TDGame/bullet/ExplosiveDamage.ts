import { _decorator, Component, Node } from 'cc';
import { DamageNode } from './DamageNode';
import { GameManager } from '../manager/GameManager';
import { log } from '../../framework/common/FWLog';
const { ccclass, property } = _decorator;

@ccclass('ExplosiveDamage')
export class ExplosiveDamage extends DamageNode {
    update(deltaTime: number) {
        super.update(deltaTime);
        if(this.die) {
            return false
        }
        this.die = true;
        log.print("ExplosiveDamage",this._monsterSet.size)
        this._monsterSet.forEach(obj=>{
            obj?.takeDamage(this.damage);
        })
        GameManager.instance.removeObj(this.node);
    }
}


