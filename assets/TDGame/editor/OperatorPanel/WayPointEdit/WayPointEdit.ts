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
    wayPathAnchors: IWayPathAnchors[];
    curWayPathAnchors: IWayPathAnchors;
    
    curIndex = 0;

    wayPointEditInfo:WayPointEditInfo;

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
        uiFunc.onClickSfx(this.node.getChildByPath("Node_right/Button_info"),this.onInfoClick.bind(this));
        uiFunc.onClickSfx(this.node.getChildByPath("Node_right/Button_add"),this.onAddWayPointClick.bind(this));
        uiFunc.onClickSfx(this.node.getChildByPath("Node_right/Button_del"),this.onDeleteWayPointClick.bind(this));
        uiFunc.onClickSfx(this.node.getChildByPath("Node_right/Button_save"),this.onSaveWayPointClick.bind(this));
        this.wayPointEditInfo = this.node.getChildByPath("Node_info").addComponent(WayPointEditInfo);
        this.wayPointEditInfo.deleteClickListener = this.onDeleteWayPathClick.bind(this);
        this.wayPointEditInfo.addClickListener = this.onAddWayPathClick.bind(this);
        this.wayPointEditInfo.selectClickListener = this.onSelectWayPathClick.bind(this);
        this.wayPointEditInfo.editBoxChangeListener = this.onSelectWayPathNameChange.bind(this);
    }

    start() {
        this.wayPointEditInfo.node.active = false;
    }

    setWayPathAnchors(wayPathAnchors: IWayPathAnchors[]) {
        this.wayPathAnchors = wayPathAnchors.map(v=>v.clone());
        if (this.wayPathAnchors.length == 0) {
            this.wayPathAnchors.push(new WayPathAnchors());
        }
        this.wayPointEditInfo.updateList(this.wayPathAnchors);
        this.selectWayPathAnchors(this.curIndex);
    }

    selectWayPathAnchors(index:number) {
        if (this.wayPathAnchors.length == 0) {
            this.curWayPathAnchors = new WayPathAnchors();
            this.curIndex = 0;
        } else {
            this.curIndex = clamp(index,0,this.wayPathAnchors.length-1);
            this.curWayPathAnchors = this.wayPathAnchors[this.curIndex].clone();
        }
        this.wayPointEditInfo.setSelect(this.curIndex,this.curWayPathAnchors);

        let wayPointPosition = this.curWayPathAnchors;
        this.poolWayPoint.freeArray(this.wayPathAutoChildren.node.children);
        this.wayPathAutoChildren.node.removeAllChildren();
        wayPointPosition.anchors.forEach(pos=>{
            let node = this.poolWayPoint.alloc()
            node.parent = this.wayPathAutoChildren.node;
            node.position = pos;
        })
        this.wayPathAutoChildren.node.emit(NodeEventType.SIBLING_ORDER_CHANGED);
    }

    update(deltaTime: number) {
        
    }

    onSaveClick() {
        // this.save(this.wayPath.anchors.map(v=>v.clone()));
        game.edit.saveWayPathAnchors(this.wayPathAnchors);
    }

    onDeleteWayPathClick(index:number) {
        if (index < 0 || index >= this.wayPathAnchors.length) return;
        this.wayPathAnchors.splice(index,1);
        this.selectWayPathAnchors(this.curIndex);
    }

    onAddWayPathClick(name:string) {
        this.wayPathAnchors.push(new WayPathAnchors(name));
    }

    onSelectWayPathClick(index:number) {
        this.selectWayPathAnchors(index);
    }

    onSelectWayPathNameChange(name:string) {
        this.wayPathAnchors[this.curIndex].name = name;
    }

    onInfoClick() {
        this.wayPointEditInfo.node.active = true;
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

    onSaveWayPointClick() {
        this.wayPathAnchors[this.curIndex].anchors = this.wayPath.anchors.map(v=>v.clone());
    }


    onDestroy(): void {
        this.poolWayPoint.destroy();
    }
}

class ScrollViewItem extends Component {
    itemName:Label;
    bg:Sprite;
    deleteClickListener:Function;
    selectClickListener:Function;

    protected onLoad(): void {
        this.itemName = this.node.getChildByName("name").getComponent(Label);
        this.bg = this.node.getComponent(Sprite);
        uiFunc.onClickSfx(this.node.getChildByName("delete"),this.onDeleteClick.bind(this));
        uiFunc.onClickSfx(this.node,this.onSelectClick.bind(this));
        this.onUnSelect();
    }

    onDeleteClick() {
        this.deleteClickListener?.(this.node.getSiblingIndex())
    }

    onSelectClick() {
        this.selectClickListener?.(this.node.getSiblingIndex())
    }

    onUnSelect() {
        this.bg.color = Color.GRAY;
    }

    onSelect() {
        this.bg.color = Color.GREEN;
    }
}

export class WayPointEditInfo extends Component {
    scrollView:ScrollView;
    scrollViewItem:Node;
    scrollViewItemPool:Pool<Node>;
    deleteClickListener:Function;
    addClickListener:(text:string)=>void;
    selectClickListener:Function;
    editBoxChangeListener:(text:string)=>void;
    editBox:EditBox;
    
    
    private selectNode:Node;

    setSelect(index:number,data:IWayPathAnchors) {
        let oldNode = this.selectNode;
        let newNode = this.scrollView.content.children[index];
        this.selectNode = newNode;
        oldNode?.getComponent(ScrollViewItem).onUnSelect();
        newNode?.getComponent(ScrollViewItem).onSelect();
        this.editBox.string = data.name;
    }

    protected onLoad(): void {
        this.editBox = this.node.getChildByPath("EditBox").getComponent(EditBox);
        this.scrollView = this.node.getChildByName("ScrollView").getComponent(ScrollView);
        this.scrollViewItem = this.node.getChildByPath("ScrollView/ScrollView_item");
        this.scrollViewItem.parent = null;
        this.scrollViewItemPool = new Pool<Node>(()=>{
            let node = instantiate(this.scrollViewItem);
            let item = node.addComponent(ScrollViewItem);
            item.deleteClickListener = this.onDeleteClick.bind(this);
            item.selectClickListener = this.onSelectClick.bind(this);
            return node;
        },10,(item)=>{
            item.destroy();
        });

        uiFunc.onClickSfx(this.node.getChildByName("Button_new"),this.onAddClick.bind(this));
        uiFunc.onClickSfx(this.node.getChildByName("Button_close"),this.onCloseClick.bind(this));

        this.editBox.node.on(EditBox.EventType.EDITING_DID_ENDED,this.onEditBoxChange,this)
        
    }

    protected start(): void {
    }

    updateList(wayPathAnchors: IWayPathAnchors[]) {
        this.scrollViewItemPool.freeArray(this.scrollView.content.children);
        this.selectNode?.getComponent(ScrollViewItem).onUnSelect();
        this.scrollView.content.removeAllChildren();
        wayPathAnchors.forEach(v=>{
            let node = this.scrollViewItemPool.alloc();
            node.parent = this.scrollView.content;
            node.getComponent(ScrollViewItem).itemName.string = v.name;
        })
    }

    onDeleteClick(index:number) {
        let node = this.scrollView.content.children[index];
        if (node) {
            this.scrollViewItemPool.free(node);
            node.parent = null;
            if(this.selectNode == node) {
                node.getComponent(ScrollViewItem).onUnSelect();
                this.selectNode = null;
            }
        }
        this.deleteClickListener?.(index);
    }

    onAddClick() {
        let node = this.scrollViewItemPool.alloc();
        node.parent = this.scrollView.content;
        let text = this.editBox.string.trim() + Date.now();
        node.getComponent(ScrollViewItem).itemName.string = text;
        this.addClickListener?.(text);
    }

    onSelectClick(index:number) {
        this.selectClickListener?.(index);
    }

    onCloseClick() {
        this.node.active = false;
    }

    onEditBoxChange() {
        let text = this.editBox.string.trim();
        if(this.selectNode && text.length > 0) {
            this.selectNode.getComponent(ScrollViewItem).itemName.string = text;
            this.editBoxChangeListener?.(text);
        }
    }

    onDestroy(): void {
        this.scrollViewItemPool.destroy();
        this.scrollViewItem.destroy();
    }
}

