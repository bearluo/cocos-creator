import { _decorator, Component, Node } from 'cc';
import { BulletNode } from './BulletNode';
import { Monster } from '../monster/Monster';
import { GameManager } from '../manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('BasicProjectile')
export class BasicProjectile extends BulletNode {

    @property
    damage:number = 100;

    takeDamage(obj:Monster) {
        if ( !super.takeDamage(obj) ) return false;
        obj?.takeDamage(this.damage);
        GameManager.instance.removeObj(this.node);
    }
}


