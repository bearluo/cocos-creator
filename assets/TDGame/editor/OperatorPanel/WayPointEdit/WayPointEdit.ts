import { _decorator, clamp, Color, Component, EditBox, instantiate, Label, math, Node, NodeEventType, Pool, Prefab, ScrollView, Sprite, Vec3 } from 'cc';
import { WayPath } from '../../../simpleWayPointSystem/WayPath';
import { uiFunc } from '../../../../framework/common/FWFunction';
import { game, gameFunc } from '../../../common/constant';
import { WayPathRenderer } from '../../../simpleWayPointSystem/WayPathRenderer';
import { WayPathAutoChildren } from '../../../simpleWayPointSystem/WayPathAutoChildren';
import { IWayPathAnchors, WayPathAnchors } from '../../../common/SceneConfig';
const { ccclass, property,type } = _decorator;

@ccclass('WayPointEdit')
export class WayPointEdit extends Component {
    @type(Node)
    simpleWayPointSystem:Node;
    @type(WayPathAutoChildren)
    wayPathAutoChildren:WayPathAutoChildren;
    @type(Prefab)
    wayPointPrefab:Prefab;
    poolWayPoint:Pool<Node>;
    wayPath:WayPath;
    WayPathRenderer:WayPathRenderer;

    curWayPathAnchorsIndex: number;
    curWayPathAnchors: IWayPathAnchors;
    
    curIndex = 0;

    // wayPointEditInfo:WayPointEditInfo;

    protected onLoad(): void {
        this.poolWayPoint = new Pool<Node>(()=>{
            return instantiate(this.wayPointPrefab);
        }, 10, (node) => {
            node.destroy();
        });
        this.wayPath = this.simpleWayPointSystem.getComponent(WayPath);
        this.WayPathRenderer = this.simpleWayPointSystem.getComponent(WayPathRenderer);
        uiFunc.onClickSfx(this.node.getChildByPath("Node_left/Button_back"),gameFunc.gotoEditMain);
        uiFunc.onClickSfx(this.node.getChildByPath("Node_left/Button_save"),this.onSaveClick.bind(this));
        uiFunc.onClickSfx(this.node.getChildByPath("Node_right/Button_add"),this.onAddWayPointClick.bind(this));
        uiFunc.onClickSfx(this.node.getChildByPath("Node_right/Button_del"),this.onDeleteWayPointClick.bind(this));
    }

    start() {
    }

    setWayPathAnchors(index:number,wayPathAnchors: IWayPathAnchors) {
        this.curWayPathAnchorsIndex = index;
        this.curWayPathAnchors = wayPathAnchors.clone();
        this.poolWayPoint.freeArray(this.wayPathAutoChildren.node.children);
        this.wayPathAutoChildren.node.removeAllChildren();
        this.curWayPathAnchors.anchors.forEach(pos=>{
            let node = this.poolWayPoint.alloc()
            node.parent = this.wayPathAutoChildren.node;
            node.position = pos;
        })
        this.wayPathAutoChildren.node.emit(NodeEventType.SIBLING_ORDER_CHANGED);
    }

    update(deltaTime: number) {
        
    }

    onSaveClick() {
        this.curWayPathAnchors.anchors = this.wayPath.anchors.map(v=>v.clone());
        game.edit.changeWayPathConfig(this.curWayPathAnchorsIndex,this.curWayPathAnchors);
    }

    onAddWayPointClick() {
        let selectIndex = this.WayPathRenderer.selectIndex;
        let childrenLen = this.wayPathAutoChildren.node.children.length;
        if (selectIndex>=0 && selectIndex<childrenLen) {
            let node = this.poolWayPoint.alloc();
            node.position = this.wayPathAutoChildren.node.children[selectIndex].position;
            this.wayPathAutoChildren.node.insertChild(node,selectIndex+1);
        } else {
            let node = this.poolWayPoint.alloc();
            node.position = Vec3.ZERO;
            this.wayPathAutoChildren.node.addChild(node);
        }
    }

    onDeleteWayPointClick() {
        let selectIndex = this.WayPathRenderer.selectIndex;
        let childrenLen = this.wayPathAutoChildren.node.children.length;
        if (selectIndex>=0 && selectIndex<childrenLen) {
            let node = this.wayPathAutoChildren.node.children[selectIndex];
            node.parent = null;
            this.poolWayPoint.free(node);
        } else {
            let node = this.wayPathAutoChildren.node.children[this.wayPathAutoChildren.node.children.length-1];
            node.parent = null;
            this.poolWayPoint.free(node);
        }
    }

    onDestroy(): void {
        this.poolWayPoint.destroy();
    }
}

