import { _decorator, CCInteger, CCString, CircleCollider2D, Collider2D, Component, Contact2DType, deserialize, IPhysics2DContact, JsonAsset, Node, Vec3 } from 'cc';
import { WayPathTracker } from '../simpleWayPointSystem/WayPathTracker';
import { PHY_GROUP } from '../common/constant';
import { BulletNode } from '../bullet/BulletNode';
const { ccclass, property,type } = _decorator;

@ccclass('Monster')
export class Monster extends Component {
    @type(CCInteger)
    monster_id:number = 0;
    wayPathTracker: WayPathTracker;
    collider2D: Collider2D;

    protected onLoad(): void {
        this.wayPathTracker = this.node.getComponent(WayPathTracker) ?? this.node.addComponent(WayPathTracker);
        this.wayPathTracker.on("WayPathTracker-end",this.onMoveEnd,this);
    }
    
    start() {
        this.collider2D = this.getComponent(Collider2D);
        this.collider2D.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider2D.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    update(deltaTime: number) {
        
    }

    reset(points: Vec3[]) {
        this.node.position = this.wayPathTracker.reset(points);
    }

    walk(deltaTime: number) {
        this.wayPathTracker.walk(deltaTime);
    }

    onMoveEnd() {
        this.node.emit("Monster-Move-end",this);
    }
    /**
     * 承受伤害
     * @param value 
     */
    takeDamage(value:number) {

    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        // console.log('onBeginContact');
        if ( otherCollider.group == PHY_GROUP.bullet) {
            let bullet = otherCollider.node.getComponent(BulletNode);
            bullet.dealDamage(this);
        }
    }

    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体结束接触时被调用一次
        // console.log('onEndContact');
    }
}


