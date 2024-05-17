import { _decorator, CCInteger, Component, Node, Vec3 } from 'cc';
import { WayPathTracker } from '../simpleWayPointSystem/WayPathTracker';
const { ccclass, property,type } = _decorator;

@ccclass('Monster')
export class Monster extends Component {
    @type(CCInteger)
    moster_id:number = 0;
    wayPathTracker: WayPathTracker;

    protected onLoad(): void {
        this.wayPathTracker = this.node.getComponent(WayPathTracker);
        this.wayPathTracker.on("WayPathTracker-end",this.onMoveEnd,this)
    }
    
    start() {

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
}


