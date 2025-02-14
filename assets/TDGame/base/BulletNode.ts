import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, Vec3 } from 'cc';
import { Monster } from '../monster/Monster';
import { GameManager } from '../manager/GameManager';
import { log } from '../../framework/common/FWLog';
import { PHY_GROUP } from '../common/constant';
import { MainThrend } from '../../framework/common/FWDecorator';
import { TDObject, TDObjectBuff } from '../base/TDObject';
const { ccclass, property } = _decorator;

var tempVec3 = new Vec3();
export class BulletNode extends Component {
    die:boolean = false;
    originObj:TDObject;
    target:Monster;
    
    @property
    speed:number = 500;

    @property
    damage:number = 100;

    protected _tempPos:Vec3 = new Vec3();
    collider2D: Collider2D;
    
    start() {
        this.die = false;
        this.collider2D = this.getComponent(Collider2D);
        this.collider2D.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider2D.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }
    
    protected onEnable() {
        GameManager.instance.addBullet(this);
    }

    protected onDisable() {
        GameManager.instance.removeBullet(this);
    }

    tick(deltaTime: number) {
        if(this.die) {
            return false
        }
        if (this.target.isValid) {
            Vec3.copy(this._tempPos,this.target.node.position)
        }
        Vec3.subtract(tempVec3,this._tempPos,this.node.position);
        let length = tempVec3.length();
        let moveL = this.speed * deltaTime;
        if( tempVec3.length() < Number.EPSILON) {
            this.takeDamage(null,this.originObj);
        } else if ( moveL < length ) {
            Vec3.add(tempVec3,this.node.position,tempVec3.normalize().multiplyScalar(moveL))
            this.node.setPosition(tempVec3);
        } else {
            this.node.setPosition(this._tempPos);
        }
    }

    takeDamage(obj:Monster, originObj:TDObject) {
        if(this.die) {
            return false
        }
        this.die = true;
        return true
    }
    /**
     * 瞄准
     * @param obj 
     */
    aim(obj:Monster) {
        this.target = obj;
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        // console.log('onBeginContact');
        if ( otherCollider.group == PHY_GROUP.monster) {
            let obj = otherCollider.node.getComponent(Monster);
            if (obj === this.target) {
                this.takeDamage(obj, this.originObj);
            }
        }
    }
    
    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体结束接触时被调用一次
        // console.log('onEndContact');
    }
}


