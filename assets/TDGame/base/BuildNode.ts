import { _decorator, Collider2D, Component, Contact2DType, instantiate, IPhysics2DContact, Node, Prefab } from 'cc';
import { Monster } from '../monster/Monster';
import { GameManager } from '../manager/GameManager';
import { PHY_GROUP } from '../common/constant';
import { BulletNode } from '../base/BulletNode';
import { TDObjectBuff } from './TDObject';
const { ccclass, property } = _decorator;

export class BuildNode extends TDObjectBuff {
    monsterList:Monster[] = [];
    collider2D: Collider2D;


    protected onEnable() {
        GameManager.instance.addBuilding(this);
    }

    protected onDisable() {
        GameManager.instance.removeBuilding(this);
    }
    
    start() {
        this.collider2D = this.getComponent(Collider2D);
        this.collider2D.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider2D.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    tick(deltaTime: number) {
    }
    
    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        // console.log('onBeginContact');
        if ( otherCollider.group == PHY_GROUP.monster) {
            this.monsterList.push(otherCollider.node.getComponent(Monster));
        }
    }

    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体结束接触时被调用一次
        // console.log('onEndContact');
        if ( otherCollider.group == PHY_GROUP.monster) {
            let monster = otherCollider.node.getComponent(Monster);
            let index = this.monsterList.indexOf(monster);
            if (index != -1) {
                this.monsterList.splice(index,1);
            }
        }
    }
}

export class FireBuildNode extends BuildNode {
    /**
     * 开火冷却时间
     */
    fireCooldownTime:number=1;
    /**
     * 开会倒计时
     */
    fireCountdown:number=0;
    /**
     * 子弹预设
     */
    @property({
        type:Prefab
    })
    bullet:Prefab;

    tick(deltaTime: number) {
        super.tick(deltaTime);
        if (this.fireCountdown > 0) {
            this.fireCountdown = this.fireCountdown - deltaTime;
        } else if(this.monsterList.length > 0) {
            this.fireCountdown = this.fireCooldownTime;
            this.fire()
        }
    }
    /**
     * 开火
     */
    fire() {
        let obj = this.monsterList[0];
        let bullet = instantiate(this.bullet);
        bullet.setPosition(this.node.position);
        let node = bullet.getComponent(BulletNode);
        node.originObj = this;
        node.aim(obj);
        GameManager.instance.addObj(bullet);
    }
}