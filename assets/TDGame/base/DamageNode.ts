import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, Vec3 } from 'cc';

import { GameManager } from '../manager/GameManager';
import { log } from '../../framework/common/FWLog';
import { PHY_GROUP } from '../common/constant';
import { TDObject } from './TDObject';
import { BaseMonster } from './BaseMonster';
const { ccclass, property } = _decorator;

var tempVec3 = new Vec3();
/**
 * 产生范围伤害的基础
 */
@ccclass('DamageNode')
export class DamageNode extends TDObject {
    originObj:TDObject;
    die:boolean = false;
    protected _tempPos:Vec3 = new Vec3();
    monsterList:BaseMonster[] = [];
    collider2D: Collider2D;
    @property
    damage:number = 100;
    /**
     * 持续时间（s）
     */
    @property
    duration:number = 0.1;
    _countdown:number = 0;
    
    protected onEnable() {
        GameManager.instance.addDamageNode(this);
    }

    protected onDisable() {
        GameManager.instance.removeDamageNode(this);
    }
    resetCountdown() {
        this._countdown = this.duration;
    }
    onLoad() {
        this.die = false;
        this.collider2D = this.getComponent(Collider2D);
        this.collider2D.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider2D.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        this.resetCountdown();
    }

    tick(deltaTime: number) {
        if( this._countdown == 0) {
            this.takeDamage(this.damage,this.originObj);
        }
        this._countdown = Math.max(0,this._countdown - deltaTime);
    }

    takeDamage(value:number, originObj:TDObject) {
        if(this.die) {
            return false
        }
        this.die = true;
        return true;
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        // console.log('onBeginContact');
        if ( otherCollider.group == PHY_GROUP.monster) {
            this.monsterList.push(otherCollider.node.getComponent(BaseMonster));
        }
    }

    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体结束接触时被调用一次
        // console.log('onEndContact');
        if ( otherCollider.group == PHY_GROUP.monster) {
            let monster = otherCollider.node.getComponent(BaseMonster);
            let index = this.monsterList.indexOf(monster);
            if (index != -1) {
                this.monsterList.splice(index,1);
            }
        }
    }
}


