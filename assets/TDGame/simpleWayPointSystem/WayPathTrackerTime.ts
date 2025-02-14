import { _decorator, Component, Eventify, math, Node, Vec3 } from 'cc';
import { WayPath } from './WayPath';
const { ccclass, property } = _decorator;

const tempVec3 = new Vec3();

@ccclass('WayPathTrackerTime')
export class WayPathTrackerTime extends Eventify(Component) {
    public path:WayPath;
    @property
    totolTime = 10;
    private _curTime = 0;
    @property
    isRunning = false;


    speedVec3 = new Vec3();
    private _curPathIndex:number = -1;
    private _curPathLen:number = -1;


    protected onLoad(): void {
        this.path = this.node.getComponent(WayPath);
    }

    start() {

    }

    update(deltaTime: number) {
        if (this.isRunning) this.tick(deltaTime);
    }
    
    tick(deltaTime: number) {
        this._curTime += deltaTime;
        this.setProgress(this._curTime / this.totolTime);
    }
     
    setProgress(progress:number) {
        progress = math.clamp01(progress);
        let num = this.path.pointCount * progress;
        let index = Math.floor(num);
        let nProgress = parseFloat((num - index).toFixed(4));
        if(index != this._curPathIndex) {
            this._curPathIndex = index;
            let curPosition = this.path.getPoint(index);
            let nextPosition = this.path.getPoint(index+1);
            this._curPathLen = Vec3.distance(curPosition, nextPosition);
            this.speedVec3 = Vec3.subtract(this.speedVec3, curPosition, nextPosition).normalize();
        }
        let offsetLen = this._curPathLen * nProgress;
        Vec3.multiplyScalar(tempVec3,this.speedVec3,offsetLen);
        this.node.translate(tempVec3)
    }
}


