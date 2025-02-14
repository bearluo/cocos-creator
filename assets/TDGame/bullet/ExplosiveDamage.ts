import { _decorator, Component, Node } from 'cc';
import { GameManager } from '../manager/GameManager';
import { log } from '../../framework/common/FWLog';
import { DamageNode } from '../base/DamageNode';
import { TDObject } from '../base/TDObject';
const { ccclass, property } = _decorator;

@ccclass('ExplosiveDamage')
export class ExplosiveDamage extends DamageNode {
    takeDamage(value:number, originObj:TDObject) {
        if(!super.takeDamage(value, originObj)) return false;
        // log.print("ExplosiveDamage",this._monsterSet.size)
        this.monsterList.forEach(obj=>{
            obj?.takeDamage(value,originObj);
        })
        GameManager.instance.removeObj(this.node);
        return true;
    }
}


