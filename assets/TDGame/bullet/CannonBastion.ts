import { _decorator, Component, instantiate, Node, PhysicsSystem2D, Prefab, Vec3 } from 'cc';
import { BulletNode } from '../base/BulletNode';
import { Monster } from '../monster/Monster';
import { GameManager } from '../manager/GameManager';
import { TDObject } from '../base/TDObject';
import { DamageNode } from '../base/DamageNode';
const { ccclass, property } = _decorator;

var tempVec3 = new Vec3();

@ccclass('CannonBastion')
export class CannonBastion extends BulletNode {
    /**
     * 区域对象
     */
    @property({
        type:Prefab
    })
    areaDamage:Prefab;
    /**
     * 伤害值
     */
    @property
    damage:number = 100;

    takeDamage(obj:Monster, originObj:TDObject) {
        if ( !super.takeDamage(obj,originObj) ) return false;
        this.dealAreaDamage();
        GameManager.instance.removeObj(this.node);
        return true;
    }

    dealAreaDamage() {
        let obj = instantiate(this.areaDamage);
        let node = obj.getComponent(DamageNode);
        node.originObj = this.originObj;
        node.damage = this.damage;
        obj.setPosition(this.node.position);
        GameManager.instance.addObj(obj);
    }
}


