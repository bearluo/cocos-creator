import { _decorator, CCBoolean, Component, Eventify, math, Node, Vec3 } from 'cc';
import { log } from '../../framework/common/FWLog';
import { EDITOR } from 'cc/env';
const { ccclass, property,type,executeInEditMode } = _decorator;

let tmp = new Vec3();
let outTmp = new Vec3();

@ccclass('WayPath')
export class WayPath extends Eventify(Component) {
    @type([Vec3])
    anchors: Vec3[] = [];
    curveAnchors: Vec3[];
    pointCount = 0;
    smoothyBetweenPoints = 20;
    maxAnchor = 10;

    @property(CCBoolean)
    set printAnchors(a) {
        log.print(JSON.stringify(this.anchorsArray));
    }
    get printAnchors() {
        return false;
    }

    get anchorsArray() {
        let array = [];
        this.anchors.every((v,i)=>Vec3.toArray(array,v,i*3));
        return array
    }

    start() {
    }

    update(deltaTime: number) {
        
    }
    
    addPoints(points: Vec3[]) {
        this.anchors = this.anchors.concat(points.map(v=>v.clone()));
        this.fixedCurve();
    }
    
    reset(points: Vec3[]) {
        this.anchors.length = 0;
        this.anchors = this.anchors.concat(points.map(v=>v.clone()));
        this.fixedCurve();
    }

    clear() {
        this.anchors.length = 0;
        this.fixedCurve();
    }

    getPoint(index)
    {
        if (index < 0) index = 0;
        //empty
        if (this.anchors.length < 1)
        {
            return Vec3.ZERO;
        }
        //line
        else if (this.anchors.length < 3)
        {
            index %= this.anchors.length;
            return this.anchors[index];
        }
        //points >= 3, can smooth to curve
        else
        {
            let totalCount = this.anchors.length * this.smoothyBetweenPoints;
            index %= totalCount;

            if (this.curveAnchors == null) this.fixedCurve();

            return WayPath.lerp(this.curveAnchors, index / totalCount);
        }
    }

    getNearistIndex(point:Vec3)
    {
        //empty
        if (this.anchors.length < 1)
        {
            return 0;
        }
        //line
        else if (this.anchors.length < 3)
        {
            let dis = math.bits.INT_MAX;
            let index = 0;
            for (let i = 0; i < this.anchors.length; i++)
            {
                let dist = Vec3.distance(point, this.anchors[i]);
                if (dist < dis)
                {
                    dis = dist;
                    index = i;
                }
            }
            return index;
        }
        //points > 2, can smooth to curve
        else
        {
            let dis = math.bits.INT_MAX;
            let index = 0;

            if (this.curveAnchors == null) this.fixedCurve();

            for (let i = 0; i < this.pointCount; i++)
            {
                let tmppoint = WayPath.lerp(this.curveAnchors, 1.0 * i / this.pointCount);
                let dist = Vec3.distance(point, tmppoint);
                if (dist < dis)
                {
                    dis = dist;
                    index = i;
                }
            }
            return index;
        }
    }

    fixedCurve() {
        //fix anchor range
        if (this.anchors.length > this.maxAnchor)
            {
                let range = this.anchors.length - this.maxAnchor;
                this.anchors.splice(0, range);
            }
    
            this.pointCount = this.anchors.length > 2 ? this.anchors.length * this.smoothyBetweenPoints : this.anchors.length;
    
            if (this.anchors.length > 1)
            {
                this.curveAnchors = new Array(this.anchors.length + 2);
                //Extension points
                this.curveAnchors[0] = Vec3.add(new Vec3(),this.anchors[0],this.anchors[0]).subtract(this.anchors[1]);
                this.curveAnchors[this.anchors.length + 1] = Vec3.add(new Vec3(),this.anchors[this.anchors.length - 1],this.anchors[this.anchors.length - 1]).subtract(this.anchors[this.anchors.length - 2]);

                for (let i = 0; i < this.anchors.length; i++)
                {
                    this.curveAnchors[i + 1] = this.anchors[i];
                }
            }
    
            // if (PathChanged != null) PathChanged.Invoke();
            this.emit("PathChanged")
    }

    private static lerp(pts:Vec3[], t:number,out:Vec3 = new Vec3()) {
        let numSections = pts.length - 3;
        let currPt = Math.min(Math.floor(t * numSections), numSections - 1);
        let u = t * numSections - currPt;

        let p0 = pts[currPt];
        let p1 = pts[currPt + 1];
        let p2 = pts[currPt + 2];
        let p3 = pts[currPt + 3];
        // ( -p0 + 3 * p1 - 3 * p2 + p3) * (u * u * u)
        Vec3.zero(outTmp);
        outTmp.subtract(p0);
        Vec3.multiplyScalar(tmp,p1,3);
        outTmp.add(tmp);
        Vec3.multiplyScalar(tmp,p2,3);
        outTmp.subtract(tmp);
        outTmp.add(p3);
        outTmp.multiplyScalar(u * u * u)
        out.add(outTmp);

        //(2 * p0 - 5 * p1 + 4 * p2 - p3) * (u * u)
        Vec3.zero(outTmp);
        Vec3.multiplyScalar(tmp,p0,2);
        outTmp.add(tmp);
        Vec3.multiplyScalar(tmp,p1,5);
        outTmp.subtract(tmp);
        Vec3.multiplyScalar(tmp,p2,4);
        outTmp.add(tmp);
        outTmp.subtract(p3);
        outTmp.multiplyScalar(u * u)
        out.add(outTmp);

        //(-p0 + p2) * u
        Vec3.zero(outTmp);
        outTmp.subtract(p0);
        outTmp.add(p2);
        outTmp.multiplyScalar(u)
        out.add(outTmp);
        
        //2 * p1
        Vec3.zero(outTmp);
        Vec3.multiplyScalar(tmp,p1,2);
        outTmp.add(tmp);
        out.add(outTmp);


        return out.multiplyScalar(0.5);
        // return 0.5 * (
        //     ( -p0 + 3 * p1 - 3 * p2 + p3) * (u * u * u)
        //     + (2 * p0 - 5 * p1 + 4 * p2 - p3) * (u * u)
        //     + (-p0 + p2) * u
        //     + 2 * p1
        //     );
    }
}


