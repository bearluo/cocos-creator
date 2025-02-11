import { _decorator, Component, instantiate, Node, PhysicsSystem2D, Prefab, Vec3 } from 'cc';
import { BulletNode } from './BulletNode';
import { Monster } from '../monster/Monster';
import { GameManager } from '../manager/GameManager';
const { ccclass, property } = _decorator;

var tempVec3 = new Vec3();

@ccclass('Explosive')
export class Explosive extends BulletNode {
    /**
     * 区域伤害
     */
    @property({
        type:Prefab
    })
    areaDamage:Prefab;

    takeDamage(obj:Monster) {
        if ( !super.takeDamage(obj) ) return false;
        this.dealAreaDamage();
        GameManager.instance.removeObj(this.node);
    }

    dealAreaDamage() {
        let obj = instantiate(this.areaDamage);
        obj.setPosition(this.node.position);
        GameManager.instance.addObj(obj);
    }
}


