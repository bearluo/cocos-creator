import { _decorator, CCBoolean, Component, Director, director, Graphics, math, Node, TransformBit, Vec3 } from 'cc';
import { WayPath } from './WayPath';
const { ccclass, property,requireComponent,executeInEditMode,type } = _decorator;

@ccclass('WayPathRenderer')
@requireComponent(Graphics)
@executeInEditMode
export class WayPathRenderer extends Component {
    @property({
        type:WayPath,
    })
    public path:WayPath;
    public draw:Graphics;
    public selectIndex:number = -1;
    @property(CCBoolean)
    set doDrawPath(a) {
        this.path.fixedCurve();
        this.drawPath();
    }
    get doDrawPath() {
        return false;
    }

    protected onLoad(): void {
        this.draw = this.node.getComponent(Graphics);
    }

    start() {
    }

    onEnable(): void {
        this.path?.event.on(this.path.event.key.PathChanged,this.drawPath,this);
    }

    onDisable(): void {
        this.path?.event.off(this.path.event.key.PathChanged,this.drawPath,this);
    }

    update(deltaTime: number) {
        
    }

    setSelectIndex(index:number) {
        this.selectIndex = index;
        this.drawPath();
    }

    drawPath() {
        if (this.path == null) return;
        if (this.draw == null) return;
        this.draw.clear();
        //set initial size based on waypoint count
        if (this.path.pointCount > 0)
        {
            this.draw.strokeColor.fromHEX('#000000');
            //draw anchor
            for (let i = 0; i < this.path.anchors.length; i++)
            {
                let point = this.path.anchors[i];
                this.draw.circle(point.x,point.y, 3);
            }

            //draw line
            let lastpos = this.path.getPoint(0);
            this.draw.moveTo(lastpos.x,lastpos.y)
            for (let i = 1; i < this.path.pointCount; i++)
            {
                let point = this.path.getPoint(i);
                this.draw.lineTo(point.x,point.y);
            }
            if(this.selectIndex >= 0) {
                let point = this.path.anchors[this.selectIndex];
                if(point) {
                    this.draw.stroke();
                    this.draw.strokeColor.fromHEX('#ff0000');
                    this.draw.circle(point.x,point.y, 3);
                }
            }
        }
        this.draw.stroke();
    }
}


