import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, Vec3 } from 'cc';
import { Monster } from '../monster/Monster';
import { GameManager } from '../manager/GameManager';
import { log } from '../../framework/common/FWLog';
import { PHY_GROUP } from '../common/constant';
const { ccclass, property } = _decorator;

var tempVec3 = new Vec3();

@ccclass('DamageNode')
export class DamageNode extends Component {
    die:boolean = false;
    protected _tempPos:Vec3 = new Vec3();
    protected _monsterSet:Set<Monster> = new Set();
    collider2D: Collider2D;
    @property
    damage:number = 100;
    
    start() {
        this.die = false;
        this.collider2D = this.getComponent(Collider2D);
        this.collider2D.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider2D.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    update(deltaTime: number) {

    }

    takeDamage(obj:Monster) {
        this._monsterSet.add(obj);
        return true
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        // console.log('onBeginContact');
        if ( otherCollider.group == PHY_GROUP.monster) {
            let obj = otherCollider.node.getComponent(Monster);
            this.takeDamage(obj);
        }
    }

    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体结束接触时被调用一次
        // console.log('onEndContact');
    }
}


