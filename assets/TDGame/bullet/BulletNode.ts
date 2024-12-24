import { _decorator, Component, Node, Vec3 } from 'cc';
import { Monster } from '../monster/Monster';
const { ccclass, property } = _decorator;

var tempVec3 = new Vec3();

@ccclass('BulletNode')
export class BulletNode extends Component {

    target:Monster;
    speed:number = 100;
    die:boolean = false;
    
    start() {

    }

    update(deltaTime: number) {
        if (this.die) {
            this.node.destroy()
        }
        if (this.target) {
            Vec3.subtract(tempVec3,this.target.node.position,this.node.position);
            this.node.setPosition(this.node.position.add(tempVec3.normalize().multiplyScalar(this.speed * deltaTime)));
        }
    }

    dealDamage(obj:Monster) {
        obj.takeDamage(100);
        this.die = true;
    }
    /**
     * 瞄准
     * @param obj 
     */
    aim(obj:Monster) {
        this.target = obj;
    }
}


