import { _decorator, Component, Node } from 'cc';
import { BulletNode } from '../base/BulletNode';
import { Monster } from '../monster/Monster';
import { GameManager } from '../manager/GameManager';
import { TDObject } from '../base/TDObject';
const { ccclass, property } = _decorator;

@ccclass('ArrowSpire')
export class ArrowSpire extends BulletNode {

    @property
    damage:number = 100;

    takeDamage(obj:Monster, originObj:TDObject) {
        if ( !super.takeDamage(obj,originObj) ) return false;
        if ( obj && obj.isValid) {
            obj?.takeDamage(this.damage,originObj);
        }
        GameManager.instance.removeObj(this.node);
        return true;
    }
}


