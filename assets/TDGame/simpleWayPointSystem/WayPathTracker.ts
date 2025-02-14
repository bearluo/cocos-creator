import { _decorator, Component, Eventify, Node, Vec3 } from 'cc';
import { WayPath } from './WayPath';
const { ccclass, property } = _decorator;

@ccclass('WayPathTracker')
export class WayPathTracker extends Eventify(Component) {
    public path:WayPath;
    private _curPathIndex:number = 0;
    @property
    speed = 10;
    @property
    isLooping = false;
    @property
    isRunning = false;

    targetPosition = new Vec3();
    speedVec3 = new Vec3();


    get curPathIndex() {
        return this._curPathIndex;
    }

    protected onLoad(): void {
        this.path = this.node.getComponent(WayPath) ?? this.node.addComponent(WayPath);
        Vec3.copy(this.targetPosition, this.path.getPoint(this._curPathIndex))
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    reset(points: Vec3[]) {
        this.path.reset(points);
        this._curPathIndex = 0;
        Vec3.copy(this.targetPosition, this.path.getPoint(this._curPathIndex))
        return this.targetPosition;
    }
    
    tick(deltaTime: number) {
        if (this.isRunning) {
            this.move(this.speed * deltaTime);
        }
    }
     
    move(moveLen:number) {
        let curPosition = this.node.position;
        let offsetLen = Vec3.distance(curPosition, this.targetPosition);
        if( offsetLen < moveLen) {
            moveLen -= offsetLen;
            this._curPathIndex += 1;
            this.node.position = this.targetPosition;
            if (this._curPathIndex >= this.path.pointCount) {
                this._curPathIndex = this.isLooping ? 0 : this.path.pointCount - 1;
                this.emit("WayPathTracker-end");
                if(!this.isLooping) {
                    return
                }
            }
            Vec3.copy(this.targetPosition, this.path.getPoint(this._curPathIndex));
            this.move(moveLen);
        } else {
            Vec3.subtract(this.speedVec3, this.targetPosition, curPosition).normalize().multiplyScalar(moveLen);
            this.node.translate(this.speedVec3)
        }
    }
}


