import { _decorator, CCInteger, CCString, CircleCollider2D, clamp, Collider2D, Component, Contact2DType, deserialize, IPhysics2DContact, JsonAsset, Node, Vec3 } from 'cc';
import { WayPathTracker } from '../simpleWayPointSystem/WayPathTracker';
import { PHY_GROUP } from '../common/constant';
import { health_bar } from '../view/health_bar';
import { GameManager } from '../manager/GameManager';
import { Log } from '../../framework/common/FWLog';
import { BaseMonster } from '../base/BaseMonster';
import { TDObject } from '../base/TDObject';
const { ccclass, property,type } = _decorator;

@ccclass('Monster')
export class Monster extends BaseMonster {
    @type(CCInteger)
    monster_id:number = 0;
    wayPathTracker: WayPathTracker;
    collider2D: Collider2D;
    health_bar: health_bar;
    health_max_val: number = 1000;
    private _health_val: number = 1000;

    protected onLoad(): void {
        this.wayPathTracker = this.node.getComponent(WayPathTracker) ?? this.node.addComponent(WayPathTracker);
        this.wayPathTracker.on("WayPathTracker-end",this.onMoveEnd,this);
        this.health_bar = this.node.getComponentInChildren(health_bar);
        this.health_bar.resetProgress(1);
        this.health_bar.node.active = false;
    }

    start() {
        // this.collider2D = this.getComponent(Collider2D);
        // this.collider2D.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        // this.collider2D.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    update(deltaTime: number) {
        
    }

    reset(points: Vec3[]) {
        this.node.position = this.wayPathTracker.reset(points);
    }

    tick(deltaTime: number) {
        super.tick(deltaTime);
        this.wayPathTracker.tick(deltaTime * this.buffAttribute.move);
    }

    onMoveEnd() {
        this.node.emit("Monster-Move-end",this);
    }
    /**
     * 承受伤害
     * @param value 
     */
    takeDamage(value:number, originObj:TDObject) {
        this.health_bar.node.active = true;
        this._health_val -=  value;
        this._health_val = clamp(this._health_val,0,this.health_max_val);
        this.health_bar.setProgress(this._health_val / this.health_max_val);
        if ( this._health_val == 0 ) {
            GameManager.instance.removeObj(this.node);
        }
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        // console.log('onBeginContact');
    }

    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体结束接触时被调用一次
        // console.log('onEndContact');
    }
}


