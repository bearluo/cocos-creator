import { _decorator, Collider2D, Component, Contact2DType, instantiate, IPhysics2DContact, Node, Prefab } from 'cc';
import { Monster } from '../monster/Monster';
import { GameManager } from '../manager/GameManager';
import { BulletNode } from '../bullet/BulletNode';
import { PHY_GROUP } from '../common/constant';
const { ccclass, property } = _decorator;

@ccclass('BuildNode')
export class BuildNode extends Component {
    
    monsterList:Monster[] = [];

    collider2D: Collider2D;
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

    start() {
        this.collider2D = this.getComponent(Collider2D);
        this.collider2D.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider2D.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    update(deltaTime: number) {
        if (this.fireCountdown > 0) {
            this.fireCountdown = this.fireCountdown - deltaTime;
        } else if(this.monsterList.length > 0){
            this.fireCountdown = this.fireCooldownTime;
            this.fire(this.monsterList[0])
        }
    }
    /**
     * 开火
     */
    fire(obj:Monster) {
        let bullet = instantiate(this.bullet);
        bullet.parent = GameManager.instance.gameLayer;
        bullet.setPosition(this.node.position);
        bullet.getComponent(BulletNode).aim(obj);
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


